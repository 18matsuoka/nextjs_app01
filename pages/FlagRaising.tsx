import styles from '../styles/FlagRaising.module.css'
import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Paper, Box, DialogTitle, DialogContentText, DialogContent } from '@mui/material';
import { orderBy } from 'firebase/firestore';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAppSelector, useAppDispatch } from '../lib/redux/hooks'



const l_flag: string = "https://4.bp.blogspot.com/-ejEwYEzL1fI/VUIHgA5c0EI/AAAAAAAAtOU/SPdeyC4FZqw/s800/3_kantou1__ibaraki.png"
const r_flag: string = "https://4.bp.blogspot.com/-h55YuXzc5jU/VUIHiInSXII/AAAAAAAAtOw/ChFtceANMEE/s800/3_kantou5__chiba.png"

function FlagRaising() {

    const userState = useAppSelector((state) => state.userInfo.user)

    const router = useRouter();

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (userState) => {
          console.log(userState, "user情報をチェック！");
          //userにはログインor登録されているかの状態がtrue/falseで入ってくるので、!userはfalse＝user情報がないとき!
          !userState && router.push("/");
        });
    
        return () => unSub();
      }, [router]);

    //左右どちらの旗揚げが出題されるかの乱数
    const question_l_or_r = (): number => Math.floor(Math.random() * 2)

    //手の上げ下げ乱数
    const left_flag_answer = (): number => Math.floor(Math.random() * 2)
    const right_flag_answer = (): number => Math.floor(Math.random() * 2)

    //左右問題の出力先
    //0:左 1:右
    let tmpDirection: number = undefined;

    //ゲーム開始時処理
    const startGame = (): void => {
        setGameFlag(false);
        setDirection(question_l_or_r());

        if (direction === 0) {
            setQuestion(left_flag_answer() === 0);
        } else {
            setQuestion(right_flag_answer() === 0);
        }
    }

    //正解表示
    const toggleAnswer = (): void => {

        //正誤判定用に値格納。問題が左右で条件分岐
        if (direction === 0) {
            setLeftAnswer(question);
        } else {
            setRightAnswer(question);
        }

        //正解数カウント
        countCorrectAnswer();

        //正誤判定用に今の問題の左右どちらの問題が出題されたかを格納
        setPreDirection(direction);

        //次の問題作成する時の左右どちらの問題の出題かを選択
        setDirection(question_l_or_r());

        //次の問題作成
        createNextQuestion();
    }


    //正解数カウント
    const countCorrectAnswer = (): void => {

        //正解の場合、カウント+1
        //左のロジック
        if (direction === 0) {
            if ((question === leftArm)) {
                setCorrectNum(correctNum + 1);
            } else {
                //不正解の場合、0点に戻す。
                setCorrectNum(0);
            }
        } else {
            //右のロジック
            if ((question === rightArm)) {
                setCorrectNum(correctNum + 1);
            } else {
                //不正解の場合、0点に戻す。
                setCorrectNum(0);
            }
        }

    }

    //次の問題作成
    const createNextQuestion = (): void => {
        if (direction === 0) {
            setQuestion(left_flag_answer() === 0);
        } else {
            setQuestion(right_flag_answer() === 0);
        }
    }

    //手と旗の上げ下げフラグ
    const toggleLeftArm = (): void => {
        setLeftArm(!leftArm);
        setLeftAnswer(undefined);
        setRightAnswer(undefined);
    };

    const toggleRightArm = (): void => {
        setRightArm(!rightArm);
        setLeftAnswer(undefined);
        setRightAnswer(undefined);
    };

    // 手の上げ下げ
    //Lower:true Raise:false
    const [leftArm, setLeftArm] = useState<boolean>(true);
    const [rightArm, setRightArm] = useState<boolean>(true);

    //正解表示
    const [leftAnswer, setLeftAnswer] = useState<boolean>(undefined);
    const [rightAnswer, setRightAnswer] = useState<boolean>(undefined);

    //ゲーム開始フラグ
    const [game_flag, setGameFlag] = useState<boolean>(true);

    //問題のアクション
    const [question, setQuestion] = useState<boolean>(undefined);

    //正解数
    const [correctNum, setCorrectNum] = useState<number>(0);

    //モーダルの開閉用
    const [open, setOpen] = useState<boolean>(false);

    //左右どちらが問題になるか
    const [direction, setDirection] = useState<number>(0);

    //一つ前の問題の左右の旗
    const [preDirection, setPreDirection] = useState<number>(0);

    //5回正解でゲームクリア
    useEffect(() => {
        if ((correctNum === 5)) { setOpen(true) }
    }, [correctNum]);

    //ゲーム終了時処理
    const gameClose = (): void => {
        setOpen(false)

        //ページのリロード
        window.location.reload()
    }

    return (
        <>
            <Layout>
                <h1 className={styles.flagTitle}>Flag-raising game</h1>
                {/* 左旗の問題 */}
                {(direction === 0) && (<p className={styles.order}>{(question === undefined) ? "" : ((question ? "Lower" : "Raise") + " a Ibaraki")}</p>)}
                {/* 右旗の問題 */}
                {(direction === 1) && (<p className={styles.order}>{(question === undefined) ? "" : ((question ? "Lower" : "Raise") + " a Chiba")}</p>)}
                <div className={styles.gameContainer}>
                    {/* 左の旗 */}
                    <div className={leftArm ? "" : styles.flag_toggle}>
                        <img src={l_flag} height="60" width="60" />
                    </div>
                    <svg height="200" width="80" className={styles.human_with_flag}>
                        {/* 頭のパーツ */}
                        <circle cx="40" cy="50" r="20" />
                        {/* 体のパーツ */}
                        <line x1="40" x2="40" y1="70" y2="130" />
                        {/* 腕のパーツ */}
                        <line x1="40" x2="00" y1="90" y2="120" className={leftArm ? "" : styles.is_left_arm_hidden} />
                        <line x1="40" x2="00" y1="90" y2="60" className={leftArm ? styles.is_left_arm_hidden : ""} />
                        <line x1="40" x2="80" y1="90" y2="120" className={rightArm ? "" : styles.is_right_arm_hidden} />
                        <line x1="40" x2="80" y1="90" y2="60" className={rightArm ? styles.is_right_arm_hidden : ""} />
                        {/* 足のパーツ */}
                        <line x1="40" x2="10" y1="130" y2="160" />
                        <line x1="40" x2="70" y1="130" y2="160" />
                    </svg>
                    {/* 右の旗 */}
                    <div className={rightArm ? "" : styles.flag_toggle}>
                        <img src={r_flag} height="60" width="60" />
                    </div>
                </div>
                <div className={styles.button_container}>
                    <Button variant="contained" onClick={toggleLeftArm} disabled={question === undefined}>▲</Button>
                    {game_flag ?
                        //ゲームスタート時に表示
                        <Button variant="contained" onClick={startGame} color="primary">START</Button>
                        //ゲーム中に表示
                        : <Button variant="contained" onClick={toggleAnswer} color="secondary">KEEP</Button>
                    }
                    <Button variant="contained" onClick={toggleRightArm} disabled={question === undefined}>▲</Button>
                </div>
                <p className={styles.getAnswer}>
                    {//ゲーム開始前は説明文表示
                        (question === undefined) ? "Press 「START」 Button to start game" :
                            //解答が存在しない時は空欄
                            ((leftAnswer === undefined) && (rightAnswer === undefined)) ? "　　" :
                                //問題の正誤に応じてメッセージ表示
                                //左右の旗でどちらが問題の時下で条件分岐
                                (((preDirection === 0) && leftAnswer === leftArm) ||
                                    (((preDirection === 1) && rightAnswer === rightArm))
                                )
                                    ? "Correct answer!" : "Wrong answer..."}</p>
                <p className={styles.getPoint}>{(correctNum === 0) ? "" : "You got " + correctNum + "Point!"}</p>

                <Modal
                    open={open}
                    onClose={() => gameClose()}
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
                            <DialogTitle>You win!</DialogTitle>
                            <DialogContent>
                                <DialogContentText>Congratulation! please close the modal to restart the game</DialogContentText>
                            </DialogContent>
                        </Box>
                    </Paper>
                </Modal>
            </Layout>
        </>
    )
}

export default FlagRaising
