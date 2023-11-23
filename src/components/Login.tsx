import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, CircularProgress, Paper, Stack, Link } from '@mui/material';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (captchaValue) { // Only proceed if captcha is solved
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          navigate("/");
        })
        .catch((error) => {
          console.log(error.code)
          let errorMessage = error.message;

          switch (error.code) {
            case 'auth/too-many-requests':
              errorMessage = 'Too many unsuccessful login attempts. Reset your password or try again later.';
              break;
            case 'auth/wrong-password':
              errorMessage = 'The password is invalid.';
              break;
            case 'auth/user-not-found':
              errorMessage = 'No user found with this email.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Invalid email address.';
              break;
            case 'auth/missing-password':
              errorMessage = 'Please enter a password.';
              break;
            case 'auth/invalid-login-credentials':
              errorMessage = 'Invalid login credentials.';
              break;
            default:
              errorMessage = error.message;
          }

          if(!toast.isActive(error.code)) {
            toast.error(errorMessage, {
              position: toast.POSITION.TOP_CENTER,
              toastId: error.code
            })
          }
        }).finally(() => {
          setLoading(false);
        });
    } else {
      toast.error("Please verify you are a human", {
        position: toast.POSITION.TOP_CENTER
      })
    }
  }

  const handleCaptchaResponseChange = (response: string | null) => {
    setCaptchaValue(response);
  }

  const handleOnResetPassword = () => {
    if(email) {
      sendPasswordResetEmail(auth, email).then(() => {
        toast.success("Password reset email sent", {
          position: toast.POSITION.TOP_CENTER
        })
      }).catch((error) => {
        toast.error(error.message, {
          position: toast.POSITION.TOP_CENTER
        })
      })
    }else{
      toast.error("Please enter your email address", {
        position: toast.POSITION.TOP_CENTER
      })
    }
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ paddingTop: 20 }}>
      <Paper
        variant='outlined'
        sx={{ padding: 4 }}
      >

        <form onSubmit={onLogin} noValidate>
          <Stack spacing={2}>
            <Typography component="h1" variant="h3">
              SBD - Torrens
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <ReCAPTCHA sitekey="6Le6cxkpAAAAAIRe67JZAvezPviDibwb1dwiN2G_" onChange={handleCaptchaResponseChange} style={{ width: "100%" }} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !captchaValue}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            <Link variant="body2" onClick={handleOnResetPassword}>Forgot credentials?</Link>
            
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;