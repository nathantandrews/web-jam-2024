'use client';
import React from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignInWithEmailAndPassword, useAuthState } from 'react-firebase-hooks/auth';
import { app, auth, db } from "../firebase.js";
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignInForm = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const router = useRouter();
  const [user] = useAuthState(auth);

  if (user) {
    router.push('/dashboard');
  }

  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email Address is required.';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const signInTheUser = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setError('');
    setErrors({ email: '', password: '' });

    try {
      signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Error signing in:');
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/dashboard');
    }
    catch (e) {
      setError(e);
      alert(e);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
      <Paper elevation={3} style={{ padding: 24 }}>
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>
        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}
       
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Email Address" variant="outlined" type="email" fullWidth onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email Address' value={email} required/>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Password" variant="outlined" type="password" fullWidth onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' value={password} required/>
          </Grid>
          <Grid item xs={12}>
            <Button sx={{ backgroundColor: '#244709' }} onClick={signInTheUser} type="submit" variant="contained" fullWidth>
            {'Sign In'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  </Grid>
  )
}

export default SignInForm;