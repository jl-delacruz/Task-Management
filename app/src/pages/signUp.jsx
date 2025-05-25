import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{6,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if (!passwordRegex.test(password)) {
            setMessage('Password must be at least 6 characters long and contain at least one uppercase letter, one number, and one special character');
            return;
        }
        
        try {
            //post to /signup
            const res = await api.post('/signup', { email, password });
            setMessage('Registration successful!');
            // Redirect to login
            navigate('/'); 
        } catch (err) {
            setMessage(err.response?.data?.message || 'Signup failed');
        }
    };

    

    return (
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
                Sign Up
            </Typography>

            <form onSubmit={handleSubmit} noValidate>

                <TextField 
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                    
                    fullWidth
                    margin="normal"
                />

                
                    <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    slotProps={{
                        input: {
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            </InputAdornment>
                        ),
                        },
                    }}
                    />



                    <TextField
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    slotProps={{
                        input: {
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                            >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            </InputAdornment>
                        ),
                        },
                    }}
                    />
                
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Sign Up
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

            <Typography variant="body2" mt={2}>
                Already have an account?{' '}
                <Link to="/" style={{ color: '#1976d2', textDecoration: 'none' }}>
                    Log In
                </Link>
            </Typography>

      </Box>
    </Box>
    );
}

export default SignUp;
