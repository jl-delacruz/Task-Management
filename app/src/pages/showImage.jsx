import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { CircularProgress, Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ShowImage = ({ imageName, alt }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      try {
        const response = await api.get(`/uploads/${imageName}`, {
          responseType: 'blob',
        });
        const blob = new Blob([response.data]);
        const imageUrl = URL.createObjectURL(blob);
        if (isMounted) setImageSrc(imageUrl);
      } catch (err) {
        console.error('Image fetch failed', err);
        if (isMounted) setImageSrc('/default-image.png');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (imageName) {
      fetchImage();
    } else {
      setImageSrc('/default-image.png');
      setLoading(false);
    }

    return () => {
      isMounted = false;
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageName]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (loading) {
    return <CircularProgress size={24} />;
  }

  return (
    <>
      <img
        src={imageSrc}
        alt={alt}
        style={{
          width: 100,
          height: 100,
          objectFit: 'cover',
          borderRadius: 4,
          border: '1px solid #ccc',
          cursor: 'pointer',
        }}
        onClick={handleOpen}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white', zIndex: 1 }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          sx={{
            p: 0,
            backgroundColor: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={imageSrc}
            alt={alt}
            style={{ maxWidth: '60vw', maxHeight: '90vh' }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShowImage;
