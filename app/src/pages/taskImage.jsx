import React, { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';

function TaskImage({ image, setImage }) {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  }, [setImage]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Upload Image:</Typography>

      <input
        type="file"
        accept="image/*"
        id="image-upload"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Box
        onClick={() => document.getElementById('image-upload').click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.400',
          backgroundColor: dragActive ? 'primary.light' : 'grey.100',
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: 2,
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
          <Typography variant="body2" color="text.secondary">
            Drag & drop an image here, or click to select
          </Typography>
      </Box>
    </Box>
  );
}

export default TaskImage;
