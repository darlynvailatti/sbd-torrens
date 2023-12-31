import Divider from '@mui/material/Divider';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import Logout from '@mui/icons-material/Logout';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useUser } from './UserContext';
import { Chip, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom"
import { useState } from 'react';

const categories = [
  {
    id: 'Main',
    children: [
      {
        id: 'People',
        icon: <PeopleIcon />,
        roles: [".*"],
        path: '/'
      },
      { id: 'Users', icon: <DnsRoundedIcon />, roles: ["admin"], path: '/users' },
    ],
  },
];

const item = {
  py: '2px',
  px: 3,
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

export default function Navigator(props: DrawerProps) {
  const [activeMenuIndex, setActiveMenu] = useState<number>(0)
  const { ...other } = props;
  const userContext = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log("Signed out successfully")
    }).catch((error) => {
      toast.error(error.message)
    });
  }

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={{ ...item, ...itemCategory }}>
          <Typography variant='h5'>SBD</Typography>

        </ListItem>

        {categories.map(({ id, children }) => (
          <Box key={id} >
            {children.map(({ id: childId, icon, roles, path }, index) => {

              const hasPermission = RegExp(roles.join("|")).test(userContext?.metadata.roles.join("|"))
              if (!hasPermission) return null

              return <ListItem disablePadding key={childId}>
                <ListItemButton selected={index === activeMenuIndex} sx={item} onClick={() => {
                    setActiveMenu(index)
                    if(path) navigate(path)
                  }}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            })}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
        <Box sx={{ flexGrow: 1 }} />
        <ListItem>
          <ListItemText><Chip color='primary' label={userContext?.username} /></ListItemText>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
