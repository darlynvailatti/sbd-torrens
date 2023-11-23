import React, { useState } from 'react';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase'
import { TextField, Button, Container, Typography, Paper } from '@mui/material';
import PasswordStrengthBar from 'react-password-strength-bar';
import { toast } from 'react-toastify';

const ResetPassword: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const oobCode = queryParams.get('oobCode') || '';
  const [password, setPassword] = useState('');
  const [passwordScore, setPasswordScore] = useState(0);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const isAllowedToResetPassword = () => {
    return oobCode !== '' && passwordScore >= 4
  }

  const resetPassword = async () => {
    try {
      if (isAllowedToResetPassword()) {
        await confirmPasswordReset(auth, oobCode, password);
        toast.success('Password reset successful! Redirecting to Login...', {
          position: toast.POSITION.TOP_CENTER,
        })
        setTimeout(() => {
          window.location.href = '/login'
        }, 4000)
      }
    } catch (error: any) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER
      })
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ paddingTop: 20 }}>
      <Paper
        variant='outlined'
        sx={{ padding: 4 }}
      >
        <Typography variant="h4">Reset Password</Typography>
        <TextField
          type="password"
          label="New Password"
          value={password}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
        />
        <PasswordStrengthBar password={password} minLength={8} onChangeScore={(score) => {setPasswordScore(score)}}/>
        <Button variant="contained" color="primary" onClick={resetPassword} disabled={!isAllowedToResetPassword()}>
          Reset Password
        </Button>
      </Paper>
    </Container>
  );
};

export default ResetPassword;