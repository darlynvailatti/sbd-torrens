import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Navigator from './Navigator';
import PeopleManagement from './PeopleManagement';
import { Route, Routes } from 'react-router-dom';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/darlynvailatti">
        Darlyn Vailatti
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}


const drawerWidth = 256;

export default function Paperbase() {
  return (
    
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: 'block', xs: 'none' } }}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box component="main" sx={{ flex: 1, py: 6, px: 4 }}>
            
            <Routes>
              <Route path="/" element={<PeopleManagement />} />
              {/* <Route path="/another" element={<AnotherComponent />} /> */}
              {/* Add more routes as needed */}
            </Routes>
          </Box>
          <Box component="footer" sx={{ p: 2,  }}>
            <Copyright />
          </Box>
        </Box>
      </Box>
  )
}
