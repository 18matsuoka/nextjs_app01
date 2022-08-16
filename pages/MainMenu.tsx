import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import '../lib/firebase'
import {
  doc,
  getDoc,
  collection,
  query,
  onSnapshot,
  updateDoc,
  addDoc,
  QuerySnapshot,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase"; //.envに書かれているfirebaseに接続するためのもの
import { signInWithRedirect, onAuthStateChanged, getRedirectResult, GoogleAuthProvider, signOut } from "firebase/auth";
import { useEffect, useState } from 'react';
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { useAuthState } from "react-firebase-hooks/auth";
import Link from 'next/link';
import Layout,{clickLogin,googleLogOut} from '../components/Layout';



export default function MainMenu({ user }) {


  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <Image src="/imageTOP.jpg" alt="TOP image" width={345} height={200} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                <p className={styles.titleText}>Game Center</p>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                If you log on to your google account,you can play with many games!
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions className={styles.titleButton}>
            {/* ログインしていない時はログインボタン表示 */}
            {!user && <Button variant="contained" color="success" onClick={() => clickLogin()}>Login</Button>}
            {/* ログインしている時はログアウトボタン表示 */}
            {user && <Button variant="contained" color="success" onClick={() => googleLogOut()}>Logout</Button>}
          </CardActions>
        </Card>
      </main>

    </div>
  )
}
