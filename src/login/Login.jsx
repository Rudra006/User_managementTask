import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Card, Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import 'tailwindcss/tailwind.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  
  const { login } = useAuth();  
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email ) {
      setError('Both fields are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);  
    setError('');  
    try {
      const response = await axios.post('https://reqres.in/api/login', {
        email,
        password
      });
      const token = response.data.token;
      login(token);  
      setSnackbar({ open: true, message: 'Login successful', severity: 'success' }); 
      navigate('/users');  
    } catch (err) {
      setError('Invalid email or password');
      setSnackbar({ open: true, message: 'Invalid email or password', severity: 'error' }); 
    } finally {
      setLoading(false);  
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
      <Card
        className="p-8 shadow-xl transform transition duration-500 hover:scale-105"
        sx={{ maxWidth: 400, borderRadius: 5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
      >
        <div className="text-center mb-6">
          <img src="https://employwise.com/wp-content/uploads/2023/12/Logo.svg" alt="Logo" className="mx-auto mb-4" />
          <Typography variant="h4" className="text-gray-800 font-bold">
            Welcome Back!
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
              error={Boolean(error)}
              helperText={error && email === '' ? 'Email is required' : ''}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
              error={Boolean(error)}
              helperText={error && password === '' ? 'Password is required' : ''}
            />
          </Box>
          {error && (
            <Typography variant="body2" color="error" className="mb-4 text-center">
              {error}
            </Typography>
          )}
          <Box className="text-center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 transition duration-300"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </Box>
        </form>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
