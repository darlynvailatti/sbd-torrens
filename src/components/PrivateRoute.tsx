import React from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export function PrivateRoute({ children }: RouteProps): JSX.Element {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // or your loading screen
  }

  return (
    <>
      {user
        ? children
        : <Navigate to="/login"/>
      }
    </>
  );
}