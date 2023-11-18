import { Navigate, RouteProps } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Box } from '@mui/system';
import { CircularProgress } from '@mui/material';
import { useUser } from './UserContext';

export function PrivateRoute({ children }: RouteProps): JSX.Element {
  const userContext = useUser()
  const [user, loading] = useAuthState(auth);

  if (loading && !userContext?.id) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  }

  return (
    <>
      {user
        ? children
        : <Navigate to="/login" />
      }
    </>
  );
}