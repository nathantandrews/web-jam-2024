'use client'
import React, { Fragment, useState, useEffect, useRef } from "react";
import { AppBar, Box, Toolbar, Button, Typography } from "@mui/material";
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase"
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const [signInPressed, setSignInPressed] = useState(false);
  const [signUpPressed, setSignUpPressed] = useState(false);

  const showSignInForm = () => {
    setSignInPressed(true);
    setSignUpPressed(false);
  };

  const showSignUpForm = () => {
    setSignInPressed(false);
    setSignUpPressed(true);
  }

  const [user] = useAuthState(auth);

  const router = useRouter();

  if (user) {
    router.push('/dashboard');
  }

  const [textWidth, setTextWidth] = useState(0);
  const textRef = useRef(null); // Ref to measure the width of the text

  useEffect(() => {
    const handleResize = () => {
      if (textRef.current) {
        setTextWidth(textRef.current.offsetWidth);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const screenWidth = window.innerWidth;
  const leftPosition = (screenWidth / 2) - (textWidth);

  return (
    <Fragment>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2, ease: 'easeInOut' }}>
                <AppBar sx={{ background: '#458018'}}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            
                        </Box>

                        <Box sx={{ position: 'absolute', top: '50%', left: `${leftPosition}px`, transform: 'translateY(-50%)',}}>
                            <Typography ref={textRef} variant="h6" className="hidden-on-load" sx={{ left: '50%', transform: `translateX(50%)`,}}>
                                Food Inventory and Meal Generator
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button sx={{ marginLeft: 'auto', color: 'white', backgroundColor: '#244709' }} variant="contained" onClick={showSignInForm}>Sign In</Button>
                            <Button sx={{ marginLeft: '10px',  marginRight: '-10px', color: 'whitesmoke', backgroundColor: '#244709' }} variant="contained" onClick={showSignUpForm}>Sign Up</Button>
                        </Box>
                    </Toolbar>
                </AppBar>

                {!user && (!signInPressed && !signUpPressed ? (<SignUpForm/>) : (signInPressed ? (<SignInForm/>) : (<SignUpForm/>)))}
            </motion.div>
        </Fragment>
  );
}
