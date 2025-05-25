import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  TableSortLabel,
} from '@mui/material';

import TaskDialog from './taskDialog';
import TaskImage from './taskImage';
import TaskCreate from './taskCreate';
import ShowImage from './showImage';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };
    fetchData();
  }, []);

  const openEditDialog = (task) => {
    setEditTask(task);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setEditTask(null);
    setDialogOpen(false);
  };

  const handleSubmit = async (taskData) => {
    try {
      if (taskData.id) {
        await api.put(`/tasks/${taskData.id}`, taskData);
        setTasks(tasks.map(t => (t.id === taskData.id ? taskData : t)));
      } else {
        const res = await api.post('/tasks', taskData);
        setTasks([res.data, ...tasks]);
      }
      closeDialog();
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.patch(`/tasks/${id}`, { status: 'Trash' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = sortField === 'created_at' ? new Date(a[sortField]) : a[sortField]?.toString() ?? '';
    const bVal = sortField === 'created_at' ? new Date(b[sortField]) : b[sortField]?.toString() ?? '';
    return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const filteredTasks = sortedTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={2}>
      <Typography variant="h2" align="center" gutterBottom>Task Manager</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <TaskCreate />
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </Box>
      </Box>

      {filteredTasks.length === 0 ? (
        <Typography>No tasks found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Subtasks</TableCell>
                <TableCell sortDirection={sortField === 'status' ? sortOrder : false}>
                  <TableSortLabel
                    active={sortField === 'status'}
                    direction={sortField === 'status' ? sortOrder : 'asc'}
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={sortField === 'created_at' ? sortOrder : false}>
                  <TableSortLabel
                    active={sortField === 'created_at'}
                    direction={sortField === 'created_at' ? sortOrder : 'asc'}
                    onClick={() => handleSort('created_at')}
                  >
                    Time
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredTasks.map(task => (
                <TableRow key={task.id} hover>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    <ShowImage imageName={task.image} alt={task.title} />
                  </TableCell>
                  <TableCell>
                    {task.subtasks?.length ? (
                      <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        {task.subtasks.map(st => (
                          <li key={st.id}>{st.title} ({st.status})</li>
                        ))}
                      </Box>
                    ) : (
                      <Typography color="text.secondary" fontStyle="italic">No subtasks</Typography>
                    )}
                  </TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{new Date(task.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => openEditDialog(task)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TaskDialog open={dialogOpen} onClose={closeDialog} onSubmit={handleSubmit} task={editTask} />
    </Box>
  );
}

export default TaskList;
