import express from 'express';
import multer from 'multer';
import path from 'path';
import authMiddleware from '../middleware/authMiddleware.js';
import pool from '../db.js';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const subTasks = JSON.parse(req.body.subTasks || '[]');
  const userId = req.user.id;
  const image = req.file ? req.file.filename : null;

  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, image)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, title, description, 'Todo', image]
    );
    const task = result.rows[0];

    // Insert subtasks
    const subtaskQueries = subTasks.map(st =>
      pool.query(
        'INSERT INTO subtasks (task_id, title, status) VALUES ($1, $2, $3)',
        [task.id, st, 'Todo']
      )
    );
    await Promise.all(subtaskQueries);

    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(`
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'task_id', s.task_id,
              'title', s.title,
              'status', s.status,
              'created_at', s.created_at,
              'updated_at', s.updated_at
            )
          ) FILTER (WHERE s.id IS NOT NULL), '[]'
        ) AS subtasks
      FROM tasks t
      LEFT JOIN subtasks s ON t.id = s.task_id
      WHERE t.user_id = $1 AND t.status != 'Trash'
      GROUP BY t.id
      ORDER BY t.id DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks with subtasks:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.patch('/:id', authMiddleware, async (req, res) => {
  const updates = req.body;
  const userId = req.user.id;
  const taskId = req.params.id;

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) {
    return res.status(400).json({ message: 'No fields provided for update' });
  }

  const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
  values.push(taskId, userId); // For WHERE clause

  try {
    const result = await pool.query(
      `UPDATE tasks SET ${setClause}, updated_at = NOW()
       WHERE id = $${values.length - 1} AND user_id = $${values.length}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found or not owned by user' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error patching task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [taskId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task permanently deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/trash', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(`
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'task_id', s.task_id,
              'title', s.title,
              'status', s.status,
              'created_at', s.created_at,
              'updated_at', s.updated_at
            )
          ) FILTER (WHERE s.id IS NOT NULL), '[]'
        ) AS subtasks
      FROM tasks t
      LEFT JOIN subtasks s ON t.id = s.task_id
      WHERE t.user_id = $1 AND t.status = 'Trash'
      GROUP BY t.id
      ORDER BY t.id DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching trash tasks with subtasks:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/subtasks/:id', authMiddleware, async (req, res) => {
  const subtaskId = req.params.id;
  const { title, status } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `UPDATE subtasks 
       SET title = $1, status = $2, updated_at = NOW() 
       WHERE id = $3 AND task_id IN (SELECT id FROM tasks WHERE user_id = $4)
       RETURNING *`,
      [title, status, subtaskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating subtask:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/subtasks', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { task_ids } = req.query;

  if (!task_ids) {
    return res.status(400).json({ message: 'task_ids query parameter is required' });
  }

  const idsArray = task_ids.split(',').map(id => parseInt(id, 10)).filter(Boolean);

  if (idsArray.length === 0) {
    return res.status(400).json({ message: 'Invalid task_ids parameter' });
  }

  try {
    // Verify the tasks belong to the user before fetching subtasks
    const tasksResult = await pool.query(
      'SELECT id FROM tasks WHERE id = ANY($1) AND user_id = $2',
      [idsArray, userId]
    );
    const validTaskIds = tasksResult.rows.map(row => row.id);

    if (validTaskIds.length === 0) {
      return res.json([]); // No tasks found for this user
    }

    const subtasksResult = await pool.query(
      `SELECT * FROM subtasks WHERE task_id = ANY($1)`,
      [validTaskIds]
    );

    res.json(subtasksResult.rows);
  } catch (err) {
    console.error('Error fetching subtasks:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;
