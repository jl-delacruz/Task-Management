import { Box, Typography, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [capsLockConfirm, setCapsLockConfirm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setMessage('Login successful');
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  const handleCapsLock = (e) => {
    setCapsLockConfirm(e.getModifierState('CapsLock'));
  };

  return (
    //Fullscreen background
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw', 
        backgroundColor: '#e0ffff', 
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: '100%',
          p: 4,
          bgcolor: 'white',
          boxShadow: 3,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Sign In
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={handleCapsLock}
            fullWidth
            required
            margin="normal"
            helperText={capsLockConfirm ? 'Caps Lock is ON' : ' '}
            error={capsLockConfirm}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign In
          </Button>
        </form>

        {message && (
          <Typography
            variant="body2"
            color={message === 'Login successful' ? 'success.main' : 'error'}
            mt={2}
          >
            {message}
          </Typography>
        )}

        <Typography variant="body2" mt={2} sx={{ color: 'gray' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#1976d2', textDecoration: 'none' }}>
          Sign Up
        </Link>
      </Typography>

      </Box>
    </Box>
  );
}

export default SignIn;
