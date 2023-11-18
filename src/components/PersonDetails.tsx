// PersonDrawer.tsx
import { Alert, Box, Card, CardContent, Chip, Drawer, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Address, Person } from '../types/common'; // Update with your actual Person type import
import { useUser } from './UserContext';

interface PersonDrawerProps {
    person: Person | null;
    onClose: () => void;
}

export const PersonDrawer = ({ person, onClose }: PersonDrawerProps) => {
    const userContext = useUser()

    const isMedicalRole = () => {
        return userContext?.metadata.roles.filter((p: string) => p === "medical").length > 0 || false
    }

    const isRetailRole = () => {
        return userContext?.metadata.roles.filter((p: string) => p === "retail").length > 0 || false
    }

    const isAdmin = () => {
        return userContext?.metadata.roles.filter((p: string) => p === "admin").length > 0 || false
    }

    return <Drawer anchor="right" open={person !== null} onClose={onClose} sx={{ width: '50%' }}>
        {person && (
            <Box sx={{ width: '100%', padding: 2 }}>

                <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h6">Personal Information</Typography>
                        <TextField fullWidth margin="normal" label="First Name" value={person.first_name} />
                        <TextField fullWidth margin="normal" label="Last Name" value={person.last_name} />
                    </CardContent>
                </Card>
                <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h6">Credit Card Information</Typography>
                        {isRetailRole() || isAdmin() ?
                            <>
                                <TextField fullWidth margin="normal" label="Credit Card Number" type="text" value={person.credit_card.number} />
                                <TextField fullWidth margin="normal" label="Expiry Date" type="text" value={person.credit_card.expire_at} />
                            </>
                            : <Alert color='warning'>You do not have permission to see retail data</Alert>

                        }

                    </CardContent>
                </Card>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="addresses">
                        <TableHead>
                            <TableRow>
                                <TableCell>Street</TableCell>
                                <TableCell>City</TableCell>
                                <TableCell>State</TableCell>
                                <TableCell>Country</TableCell>
                                <TableCell>Postal Code</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {person.addresses.map((address: Address, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{address.country}</TableCell>
                                    <TableCell>{address.city}</TableCell>
                                    <TableCell>{address.state}</TableCell>
                                    <TableCell>{address.country}</TableCell>
                                    <TableCell>{address.postal_code}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Card sx={{ marginTop: 2 }}>
                    <CardContent>
                        <Typography variant="h6">Medical Information</Typography>
                        {isMedicalRole() || isAdmin() ?
                            <>
                                 {person.medical_status.map((status: string, index: number) => (
                                <Chip key={index} label={status} sx={{ marginRight: 1, marginBottom: 1 }} />
                            ))}
                            </>
                            : <Alert color='warning'>You do not have permission to see medical data</Alert>

                        }

                    </CardContent>
                </Card>
            </Box>
        )}
    </Drawer>
}