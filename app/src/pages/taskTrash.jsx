import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Button,
  TableSortLabel,
  Box,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';

import SignOut from './signOut';
import ShowImage from './showImage';

function TaskTrash() {
  const [tasks, setTasks] = useState([]);
  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    const fetchTasksAndSubtasks = async () => {
      const token = localStorage.getItem('token');
      try {
        const resTasks = await api.get('/tasks/trash', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tasks = resTasks.data;

        const taskIds = tasks.map(t => t.id).join(',');
        if (taskIds.length === 0) return;

        const resSubtasks = await api.get(`/tasks/subtasks?task_ids=${taskIds}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const subtasks = resSubtasks.data;

        const tasksWithSubtasks = tasks.map(task => ({
          ...task,
          subtasks: subtasks.filter(st => st.task_id === task.id)
        }));

        setTasks(tasksWithSubtasks);
      } catch (err) {
        console.error('Failed to fetch tasks or subtasks:', err);
      }
    };

    fetchTasksAndSubtasks();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let aVal = a[orderBy];
    let bVal = b[orderBy];

    if (orderBy === 'created_at') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else {
      aVal = aVal?.toString().toLowerCase();
      bVal = bVal?.toString().toLowerCase();
    }

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const handleRestore = async (id) => {
    const task = tasks.find(t => t.id === id);
    const token = localStorage.getItem('token');
    try {
      await api.patch(`/tasks/${id}`, {
        title: task.title,
        description: task.description,
        status: 'Todo'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      console.error('Failed to restore task:', err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to permanently delete task:', err);
    }
  };

  return (
    <>
    <AppBar position="fixed" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '64px',
            px: 2,
          }}
        >
          <Typography variant="h4">My Trash</Typography>
          <Box display="flex" gap={4} mr={2}>
            <Button 
            component={Link} 
            to="/dashboard" 
            variant="contained"
            color="primary"
            >
              Back
            </Button>
            <SignOut />
          </Box>
        </Toolbar>
      </AppBar>
    <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
              width: '100vw',
              backgroundColor: '#e0ffff',
              p: 3,
            }}
          >
    <Box p={3}>
      <Typography 
        variant="h2" 
        gutterBottom
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}
        >Task Trash
      </Typography>

      {tasks.length === 0 ? (
        <Typography>No tasks found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? order : 'asc'}
                    onClick={() => handleSort('title')}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image</TableCell>

                <TableCell>Subtasks</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'created_at'}
                    direction={orderBy === 'created_at' ? order : 'asc'}
                    onClick={() => handleSort('created_at')}
                  >
                    Time
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    <ShowImage imageName={task.image} alt={task.title} />
                  </TableCell>
                  <TableCell>
                    {task.subtasks?.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {task.subtasks.map((subtask) => (
                          <li key={subtask.id}>
                            {subtask.title} ({subtask.status})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <em style={{ color: '#777' }}>No subtasks</em>
                    )}
                  </TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{new Date(task.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleRestore(task.id)}
                      variant="contained"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      Restore
                    </Button>
                    <Button
                      onClick={() => handleDelete(task.id)}
                      variant="outlined"
                      color="error"
                      size="small"
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

    </Box>
    </Box>
    </>
  );
}

export default TaskTrash;
