import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Pagination,
  CircularProgress,
  Box,
  Typography,
  Card,
  Paper,
  TableContainer,
  Modal,
  TextField,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import 'tailwindcss/tailwind.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1); 
  const { token, logout } = useAuth();  
  const [editUserId, setEditUserId] = useState(null); 
  const [editUserData, setEditUserData] = useState({ name: '', job: '' }); 
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [filteredUsers, setFilteredUsers] = useState([]); 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async (currentPage) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      setUsers(response.data.data); 
      setTotalPages(response.data.total_pages); 
    } catch (error) {
      console.log('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchUsers(value);
  };

  const handleLogout = () => {
    logout();  
    navigate('/login');  
  };

  const handleEditClick = (user) => {
    setEditUserId(user.id); 
    setEditUserData({ name: user.first_name, job: '' }); 
    setOpenEditModal(true); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUserData({ ...editUserData, [name]: value });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`https://reqres.in/api/users/${editUserId}`, editUserData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editUserId ? { ...user, first_name: editUserData.name } : user
        )
      );
      setSnackbarMessage('User updated successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setOpenEditModal(false); 
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setOpenDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://reqres.in/api/users/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete));
      setSnackbarMessage('User deleted successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setOpenDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Filter users based on search query
  useEffect(() => {
    const filtered = users.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      return (
        fullName.includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  useEffect(() => {
    if (token) {
      fetchUsers(page);
    }
  }, [token, page, fetchUsers]);

  return (
    <Box
      className="min-h-screen flex items-center justify-center"
      sx={{
        background: 'linear-gradient(to right, #74ebd5, #ACB6E5)', 
        padding: '2rem'
      }}
    >
      <Card
        className="shadow-lg w-full md:w-2/3 lg:w-3/5"
        sx={{ borderRadius: 5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)', padding: '2rem' }}
      >
        <Typography variant="h4" className="text-blue-600 font-bold text-center mb-6">
          User List
        </Typography>

        <div className="flex justify-between mb-4">
          <TextField
            variant="outlined"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
            sx={{ width: '300px' }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </Button>
        </div>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell className="font-bold text-blue-900">Avatar</TableCell>
                  <TableCell className="font-bold text-blue-900">First Name</TableCell>
                  <TableCell className="font-bold text-blue-900">Last Name</TableCell>
                  <TableCell className="font-bold text-blue-900">Email</TableCell>
                  <TableCell className="font-bold text-blue-900">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      transition: 'background-color 0.3s',
                      '&:hover': {
                        backgroundColor: '#e6f7ff'
                      }
                    }}
                  >
                    <TableCell>
                      <Avatar alt={user.first_name} src={user.avatar} className="mx-auto" />
                    </TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(user)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(user.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            className="transform transition duration-300 hover:scale-110"
          />
        </Box>

        <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <Box
            className="w-full md:w-1/2 mx-auto my-20 bg-white p-8 rounded-lg"
            sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
          >
            <Typography variant="h6" className="text-center mb-4">
              Edit User
            </Typography>
            <TextField
              label="First Name"
              variant="outlined"
              name="name"
              value={editUserData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Job"
              variant="outlined"
              name="job"
              value={editUserData.job}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveEdit}
              className="w-full mt-4"
            >
              Save
            </Button>
          </Box>
        </Modal>

        <Modal open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
          <Box
            className="w-full md:w-1/3 mx-auto my-20 bg-white p-8 rounded-lg"
            sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
          >
            <Typography variant="h6" className="text-center mb-4">
              Confirm Deletion
            </Typography>
            <Typography variant="body1" className="text-center mb-4">
              Are you sure you want to delete this user?
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="error"
                onClick={confirmDelete}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpenDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
          <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Card>
    </Box>
  );
};

export default Users;
