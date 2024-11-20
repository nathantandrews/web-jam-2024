"use client";
import React, { Fragment, useEffect, useState } from "react";

import {
  AppBar, Button, Box, Card, CardContent, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, Grid, Paper, TextField, Toolbar, Typography,
} from "@mui/material";

import { app, auth, db } from "../../firebase";
import { useRouter } from "next/navigation";
import { signOut, deleteUser } from "firebase/auth";
import { deleteDoc, doc, getDoc, listCollections, writeBatch, collection, } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import LoginIcon from "@mui/icons-material/Login";
import GridViewIcon from '@mui/icons-material/GridView';
import firebase from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";

const page = () => {

    const [user] = useAuthState(auth);
    const [text, setText] = useState("");
    const router = useRouter();

    const logTheUserOut = () => {
      signOut(auth);
      router.push("/");
    };

    const wipeClean = async () => {
      const userToDelete = auth.currentUser;
  
      try {
        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(userToDelete);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push("/");
      } catch (error) {
        console.log("Error deleting user:");
      }
    };

    const [textWidth, setTextWidth] = useState(0);
    const textRef = useRef(null); // Ref to measure the width of the text

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          console.log("Logged in!");
        } else {
          setUser(null);
          router.push("/");
        }
      });

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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2, ease: "easeInOut" }}>
          <AppBar sx={{ background: "#063970" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <RecentActorsIcon className="hidden-on-load" style={{ color: "#ffffff" }}/>
              </Box>
  
              <Box sx={{ position: 'absolute', top: '50%', left: `${leftPosition}px`, transform: 'translateY(-50%)',}}>
                  <Typography ref={textRef} variant="h6" className="hidden-on-load" sx={{ left: '50%', transform: `translateX(50%)`,}}>
                    Meal Dashboard
                  </Typography>
              </Box>
  
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton sx={{ marginLeft: "auto", marginRight: "10px" }} className="hidden-on-load" variant="contained" style={{ color: "#ffffff" }} onClick={viewSets}>
                  <GridViewIcon />
                </IconButton>

                <IconButton sx={{ marginLeft: "10px", marginRight: "10px" }} className="hidden-on-load"  variant="contained" style={{ color: "#ffffff" }} onClick={logTheUserOut}>
                  <LoginIcon/>
                </IconButton>

                <IconButton sx={{ marginLeft: "10px", marginRight: "-0px" }} className="hidden-on-load" variant="contained" style={{ color: "#ffffff" }} onClick={wipeClean}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
        </motion.div>
      </Fragment>
    );
}; 