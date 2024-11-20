'use client';
import React from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateUserWithEmailAndPassword, useAuthState } from 'react-firebase-hooks/auth';
import { app, auth, db } from "../firebase"
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

const SignUpForm = () => {

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({ email: '', firstName: '', lastName: '', password: '' });
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

  if (user) {
    router.push('/dashboard');
  }

  async function addDocument(docId, data) {
    try {
      const docRef = doc(db, "users", docId);
      await setDoc(docRef, data);
    } catch (e) {
      setError("Error saving you to the database");
    }
  }

  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email Address is required.';
      isValid = false;
    }
    if (!firstName) {
      newErrors.firstName = 'First Name is required.';
      isValid = false;
    }
    if (!lastName) {
      newErrors.lastName = 'Last Name is required.';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const registerTheUser = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!validate()) {
      return;
    }

    setError('');

    // Authenticate the user and save them to the database
    try {
        const res = await createUserWithEmailAndPassword(email, password);
        const importantId = res.user.uid;
        
        addDocument(importantId, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            id: importantId
        });

        setEmail('');
        setFirstName('');
        setLastName('');
        setError('');
        setPassword('');
    } catch (e) {
        setError(e);
        alert(e);
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push('/dashboard');
    } catch (error) {
      setError('An error occured. Please try again.');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
      <Paper elevation={3} style={{ padding: 24 }}>
        <Typography variant="h4" gutterBottom>
          Create Account
        </Typography>
        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="First Name" variant="outlined" fullWidth onChange={(e) => setFirstName(e.target.value)} value={firstName} placeholder='Enter First Name' required/>
          </Grid>
          <Grid item xs={12}>
              <TextField label="Last Name" variant="outlined" fullWidth onChange={(e) => setLastName(e.target.value)} value={lastName} placeholder='Enter Last Name' required/>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email Address" variant="outlined" type="email" fullWidth onChange={(e) => setEmail(e.target.value)} value={email} placeholder='Enter Email Address' required/>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Password" variant="outlined" type="password" fullWidth onChange={(e) => setPassword(e.target.value)} value={password} placeholder='Enter Password' required/>
          </Grid>
          <Grid item xs={12}>
            <Button sx={{ backgroundColor: '#244709' }} type="submit" variant="contained" fullWidth onClick={registerTheUser}>
              {'Sign Up'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  </Grid>
  )
}

export default SignUpForm;