import React, { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import { useUser } from './UserContext';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const userContext = useUser();

  if (userContext && userContext.metadata.roles.includes('admin')) {
    return <>{children}</>;
  } else {
    return <Alert severity="error">You do not have permission to view this page.</Alert>;
  }
}

export default AdminRoute;