import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Drawer, AppBar, Paper, Stack, Typography, List, ListItem, ListItemText } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";
import { User } from '../types/common';

function Users() {
    const [users, setUsers] = useState<Array<User>>([]);
    const [selectedUser, setSelectedUser] = useState<User | undefined>();

    useEffect(() => {
        getDocs(collection(db, 'user')).then((snapShot) => {
            const loadedUsers = snapShot.docs.map((userDocument) => {
                return userDocument.data() as User
            })
            setUsers(loadedUsers)
        })
    }, []);

    return (
        <Stack spacing={2}>
            <Typography variant='h3'>Users</Typography>
            <Paper sx={{ margin: 'auto', overflow: 'hidden' }}>
                <AppBar position="static">

                </AppBar>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Roles</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.user_id}>
                                    <TableCell>{user.user_id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.roles.join(', ')}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => setSelectedUser(user)}>
                                            <InfoIcon />
                                        </IconButton>
                                        {/* <IconButton onClick={() => handleDelete(user.user_id)}>
                                            <DeleteIcon />
                                        </IconButton> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {selectedUser && <UserDrawer user={selectedUser} onClose={() => setSelectedUser(undefined)} />}
            </Paper>
        </Stack>
    );
}

export interface UserDrawerProps {
    user: User
    onClose: () => void
}

function UserDrawer({ user, onClose }: UserDrawerProps) {

    return (
        <Drawer anchor="right" open={true} onClose={onClose}>
            <List>
                <ListItem>
                    <ListItemText primary="Name" secondary={user?.name} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Roles" secondary={user?.roles} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="UID" secondary={user?.user_id} />
                </ListItem>
                {/* Add more fields as needed */}
            </List>
            {/* <div>
                <h2>{user.user_id}</h2>
                <input value={roles.join(',')} onChange={e => setRoles(e.target.value.split(','))} />
                <Button onClick={handleSave}>Save</Button>
            </div> */}
        </Drawer>
    );
}

export default Users;