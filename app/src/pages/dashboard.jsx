import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import TaskCreate from './taskCreate';
import TaskList from './taskList';
import SignOut from './signOut';
import TrashButton from './trashButton'; // renamed

function Dashboard() {
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
          <Typography variant="h4">My Tasks</Typography>

          <Box display="flex" gap={4} mr={8}>
            <TrashButton />
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
        <Box
          sx={{
            maxWidth: 600,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <TaskList />
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
