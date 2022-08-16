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
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, DialogContent, DialogContentText, DialogTitle, Modal, Paper, Typography } from '@mui/material';
import { useAuthState } from "react-firebase-hooks/auth";
import Link from 'next/link';

const provider = new GoogleAuthProvider();

//ログイン処理
export const clickLogin = function () {
  signInWithRedirect(auth, provider);
}

//ログアウト処理
export const googleLogOut = async () => {
  try {
    await signOut(auth);
    console.log("test")
  } catch (error) {
    alert(error.message);
  }
};

export default function Layout({ children, user }) {


const [helpOpen,setHelpOpen] = useState<boolean>(false);

  // useEffect(() => {
  //   getRedirectResult(auth)
  //     .then((result) => {
  //       console.log(result);
  //       if (result !== null) {
  //         const credential = GoogleAuthProvider.credentialFromResult(result);
  //         const token = credential?.accessToken;
  //         // The signed-in user info.
  //         console.log(user, "user");
  //       }
  //     }).catch((error) => {
  //       console.error(error);
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       const email = error.email;
  //       // console.error(errorCode);
  //       // console.error(errorMessage);
  //       // console.error(email);
  //       // The AuthCredential type that was used.
  //       //const credential = GoogleAuthProvider.credentialFromError(error);
  //     });
  // }, []);



  return (
    <div className={styles.container}>

      <Head>
        <title>Game Center App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        {/* ログインしていない時はログインボタン表示 */}
        {!user && <Button variant="contained" color="success" onClick={() => clickLogin()}>Login</Button>}
        {/* ログインしている時はログアウトボタン表示 */}
        {user && <Button variant="contained" color="success" onClick={() => googleLogOut()}>Logout</Button>}
        <Button variant="contained" color="success" onClick={() => setHelpOpen(true)}>Help</Button>
      </header>
      <hr />
      <main>
        {children}
      </main>
      <Modal
                    open={helpOpen}
                    onClose={() => setHelpOpen(false)}
                >
                    <Paper
                        style={{
                            left: '50%',
                            top: '50%',
                            position: 'absolute',
                            maxWidth: '100%',
                            minWidth: '400px',
                            maxHeight: '70%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <Box textAlign="center">
                            <DialogTitle>ゲームセンター</DialogTitle>
                            <DialogContent>
                                <DialogContentText textAlign="left">〇本アプリでは下記3つのゲームが遊べます。</DialogContentText>
                                <DialogContentText textAlign="left">　</DialogContentText>
                                <DialogContentText textAlign="left">・Flag Raising Game</DialogContentText>
                                <DialogContentText textAlign="left">説明：一人用の千葉と茨城で行う旗揚げゲーム</DialogContentText>
                                <DialogContentText textAlign="left">・Don't exceed 100!</DialogContentText>
                                <DialogContentText textAlign="left">説明：多人数で遊べる引いたトランプの数の総和が100を超えたら負けのゲーム</DialogContentText>
                                <DialogContentText textAlign="left">・BlackJack</DialogContentText>
                                <DialogContentText textAlign="left">説明：一人用のブラックジャックゲーム</DialogContentText>

                            </DialogContent>
                        </Box>
                    </Paper>
                </Modal>

    </div>
  )
}
