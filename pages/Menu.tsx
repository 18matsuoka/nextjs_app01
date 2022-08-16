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
import Layout, { clickLogin, googleLogOut } from '../components/Layout';



export default function Menu({ user }) {


    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                        <Image src="/imageTOP.jpg" alt="TOP image" width={345} height={200} />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                <p className={styles.titleText}>Select game...</p>
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions className={styles.selectGame}>
                        <Button variant="contained" color="secondary"><Link href="./FlagRaising">flag raising game(1 player)</Link></Button>
                        <Button variant="contained" color="secondary">Don't exceed 100!(vs Players)</Button>
                        <Button variant="contained" color="secondary">BlackJack(vs CPU)</Button>
                    </CardActions>
                </Card>

            </main>

        </div>
    )
}
