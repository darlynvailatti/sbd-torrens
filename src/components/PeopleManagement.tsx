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
import { Alert, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PersonDrawer } from './PersonDetails';
import { alpha } from '@mui/material/styles';
import { useUser } from './UserContext';
import { Stack } from '@mui/system';
import { useDebounce } from 'use-debounce';


export default function PeopleManagement() {
  const userContext = useUser()
  const [loading, setLoading] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [filteredPeople, setFilteredPeople] = useState(Array<Person>); 
  const [filterText, setFilterText] = useState('');
  const [debouncedFilterText] = useDebounce(filterText, 500); 
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const loadPeople = async () => {
    const peopleCollection = collection(db, 'people');
    const peopleSnapshot = await getDocs(peopleCollection);
    const peopleList = peopleSnapshot.docs.map(doc => doc.data() as Person);

    const filteredPeople = peopleList.filter((person) => {
      try {
        if (debouncedFilterText === '*') {
          return true;
        }
        const regex = new RegExp(`${debouncedFilterText}.*`, 'i');
        const valueToBeTested = `${person.first_name} ${person.last_name}`
        return regex.test(valueToBeTested)
      } catch (error) {
        console.error("Invalid filter: ", debouncedFilterText, error)
        return false
      }
    })
    setFilteredPeople(filteredPeople)
    setLoading(false);
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

  const isAdmin = () => {
    return userContext?.metadata.roles.filter((p: string) => p === "admin").length > 0 || false
  }

  const isNormal = () => {
    return userContext?.metadata.roles.filter((p: string) => p === "normal").length > 0 || false
  }

  useEffect(() => {
    loadPeople();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadPeople()
    // eslint-disable-next-line
  }, [debouncedFilterText])

  useEffect(() => {
    setLoading(true)
  }, [filterText])


  return (
    <Stack spacing={2}>

      <Typography variant='h3'>People</Typography>
      {userContext?.metadata && !isAdmin() ? <Alert severity="warning">
        You're logged with the following roles {JSON.stringify(userContext?.metadata.roles)}. Limited access might be applied
      </Alert> : <Alert severity='info'>You're logged as administrator</Alert>}

      {/* <Paper sx={{ margin: '5', overflow: 'hidden' }}> */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '25px' }}
      >

        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SearchIcon color="inherit" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Search by First Name or Last Name (Regex is available)"
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
      {filteredPeople ? <TableContainer component={Paper} variant='outlined'>
      {loading ? <LinearProgress sx={{width: "100%"}}/> : null}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>State</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Postal Code</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {filteredPeople.map((person) => {
              const firstAddress = person.addresses.at(0) || { country: '', state: '', city: '', postal_code: '' }
              return <TableRow key={person.uid} onClick={() => handleRowClick(person)}
                onMouseEnter={() => setHoveredRow(person.uid)}
                onMouseLeave={() => setHoveredRow(null)}
                sx={{ backgroundColor: hoveredRow === person.uid ? alpha('#000', 0.2) : 'inherit' }}>
                <TableCell>{person.first_name}</TableCell>
                <TableCell>{person.last_name}</TableCell>
                <TableCell>{firstAddress.country}</TableCell>
                <TableCell>{firstAddress.state}</TableCell>
                <TableCell>{firstAddress.city}</TableCell>
                <TableCell>{firstAddress.postal_code}</TableCell>
                {/* <TableCell>{person.state}</TableCell>
                <TableCell>{person.postal_code}</TableCell> */}
              </TableRow>
            })}
          </TableBody>
        </Table>
      </TableContainer> : <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
        No users for this project yet
      </Typography>}

      {!isNormal() ? <PersonDrawer person={selectedPerson} onClose={handleDrawerClose} /> : null}

      {/* </Paper> */}
    </Stack>
  );
}
