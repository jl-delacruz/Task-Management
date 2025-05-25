import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';

import TaskImage from './taskImage';

export default function TaskDialog({ open, onClose, onSubmit, task }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'To do');
  const [subtasks, setSubtasks] = useState(task?.subtasks ? task.subtasks.map(st => ({ ...st })) : []);
  const [editedImageFile, setEditedImageFile] = useState(null);

  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setStatus(task?.status || 'To do');
    setSubtasks(task?.subtasks ? task.subtasks.map(st => ({ ...st })) : []);
    setEditedImageFile(null);
  }, [task]);

  const handleSubtaskChange = (index, field, value) => {
    const updated = [...subtasks];
    updated[index] = { ...updated[index], [field]: value };
    setSubtasks(updated);
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { id: Date.now(), title: '', status: 'To do' }]);
  };

  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSubmit({
      ...task,
      title,
      description,
      status,
      subtasks,
      image: editedImageFile
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <TextField
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Box>

        <Box 
        mb={2}
        
        >
          <TaskImage 
            image={editedImageFile || task?.image} 
            setImage={setEditedImageFile} 
            />
        </Box>

        

        <Box mb={2}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value="To do">To do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box mb={1} fontWeight="bold">Subtasks</Box>
        {subtasks.length === 0 && <Typography color="text.secondary" fontStyle="italic">No subtasks</Typography>}

        {subtasks.map((subtask, index) => (
          <Box key={subtask.id} display="flex" alignItems="center" mb={1} gap={1}>
            <TextField
              label="Subtask title"
              value={subtask.title}
              onChange={e => handleSubtaskChange(index, 'title', e.target.value)}
              fullWidth
            />
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={subtask.status}
                label="Status"
                onChange={e => handleSubtaskChange(index, 'status', e.target.value)}
              >
                <MenuItem value="To do">To do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <Button color="error" onClick={() => removeSubtask(index)}>Remove</Button>
          </Box>
        ))}

        <Button variant="outlined" onClick={addSubtask} sx={{ mt: 1 }}>
          Add Subtask
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!title.trim()}
        >
          {task ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
