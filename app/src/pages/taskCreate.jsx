import React, { useState } from 'react';
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskImage from './taskImage';
import api from '../utils/api';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxHeight: '80vh',      // 👈 Limit height
  overflowY: 'auto',      // 👈 Enable scroll
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};


function TaskCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [subTasks, setSubTasks] = useState([{ id: Date.now(), title: '' }]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, { id: Date.now(), title: '' }]);
  };

  const handleSubTaskChange = (id, value) => {
    setSubTasks(subTasks.map(st => (st.id === id ? { ...st, title: value } : st)));
  };

  const handleRemoveSubTask = (id) => {
    setSubTasks(subTasks.filter(st => st.id !== id));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    const validSubTasks = subTasks
      .map(st => st.title.trim())
      .filter(t => t.length > 0);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) formData.append('image', image);
    formData.append('subTasks', JSON.stringify(validSubTasks));

    try {
      await api.post('/tasks', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Reset
      setTitle('');
      setDescription('');
      setImage(null);
      setSubTasks([{ id: Date.now(), title: '' }]);
      handleClose();
      window.location.reload();
    } catch (err) {
      console.error('Failed to add task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Task
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle} component="form" onSubmit={handleAddTask}>
          <Typography variant="h6" gutterBottom>Create a New Task</Typography>

          <TextField
            label="Title"
            fullWidth
            required
            margin="normal"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <TextField
            label="Description (optional)"
            fullWidth
            margin="normal"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <TaskImage 
          image={image} 
          setImage={setImage} 
          />

          <Typography 
          variant="subtitle1" 
          sx={{ mt: 2 }}

          >Subtasks
          </Typography>
          {subTasks.map((st, idx) => (
            <Box key={st.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                fullWidth
                placeholder={`Subtask ${idx + 1}`}
                value={st.title}
                onChange={e => handleSubTaskChange(st.id, e.target.value)}
              />
              <IconButton onClick={() => handleRemoveSubTask(st.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddSubTask}
            sx={{ mb: 2 }}
          >
            Add Subtask
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Confirm'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default TaskCreate;
