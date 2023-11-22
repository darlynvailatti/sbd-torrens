import React, { ChangeEvent, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";
import { Person } from '../types/common';
import { Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PersonDrawer } from './PersonDetails';
import { alpha } from '@mui/material/styles';
import { useUser } from './UserContext';
import { Stack } from '@mui/system';


export default function PeopleManagement() {
  const userContext = useUser()
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [people, setPeople] = useState(Array<Person>);
  const [filterText, setFilterText] = useState('');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const loadPeople = async () => {
    const peopleCollection = collection(db, 'people');
    const peopleSnapshot = await getDocs(peopleCollection);
    const peopleList = peopleSnapshot.docs.map(doc => doc.data() as Person);
    setPeople(peopleList);
  }

  const handleRowClick = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleDrawerClose = () => {
    setSelectedPerson(null);
  };

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const filteredPeople = people.filter(person =>
    person.first_name.toLowerCase().includes(filterText.toLowerCase()) ||
    person.last_name.toLowerCase().includes(filterText.toLowerCase())
  );

  const isAdmin = () => {

    return userContext?.metadata.roles.filter((p: string) => p === "admin").length > 0 || false
  }

  useEffect(() => {
    loadPeople();
  }, []);

  return (
    <Stack spacing={2}>

      <Typography variant='h3'>People</Typography>
      {userContext?.metadata && !isAdmin() ? <Alert severity="warning">
        You're logged with the following roles {JSON.stringify(userContext?.metadata.roles)}. Limited access might be applied
      </Alert> : null}
      
      <Paper sx={{ margin: 'auto', overflow: 'hidden' }}>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
        >

          <Toolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <SearchIcon color="inherit" sx={{ display: 'block' }} />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  placeholder="Search by First Name or Last Name"
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: 'default' },
                  }}
                  variant="standard"
                  value={filterText}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item>
                {/* <Button variant="contained" sx={{ mr: 1 }}>
                Add user
              </Button> */}
                <Tooltip title="Reload">
                  <IconButton onClick={loadPeople}>
                    <RefreshIcon color="inherit" sx={{ display: 'block' }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        {people ? <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Country</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPeople.map((person) => (
                <TableRow key={person.uid} onClick={() => handleRowClick(person)}
                  onMouseEnter={() => setHoveredRow(person.uid)}
                  onMouseLeave={() => setHoveredRow(null)}
                  sx={{ backgroundColor: hoveredRow === person.uid ? alpha('#000', 0.2) : 'inherit' }}>
                  <TableCell>{person.first_name}</TableCell>
                  <TableCell>{person.last_name}</TableCell>
                  <TableCell>{person.addresses.at(0)?.country}</TableCell>
                  {/* <TableCell>{person.state}</TableCell>
                <TableCell>{person.postal_code}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> : <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
          No users for this project yet
        </Typography>}

        <PersonDrawer person={selectedPerson} onClose={handleDrawerClose} />


      </Paper>
    </Stack>
  );
}
