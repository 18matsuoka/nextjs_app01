import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Modal, Paper } from '@mui/material'
import { Box } from '@mui/system'
import { useState, useEffect } from 'react'
import styles from '../styles/DontExceed100.module.css'
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
import { onAuthStateChanged } from "firebase/auth";
import { signInWithRedirect } from "firebase/auth";
import { getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import useSound from 'use-sound';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAppSelector, useAppDispatch } from '../lib/redux/hooks'



function BlackJack() {

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

    //認証ロジック
    const provider = new GoogleAuthProvider();
    const clickLogin = function () {
        signInWithRedirect(auth, provider);
    }
    useEffect(() => {
        getRedirectResult(auth)
            .then((result) => {
                console.log(result);
                if (result !== null) {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential?.accessToken;
                    // console.log(token,"token");
                    // The signed-in user info.
                    const user = result.user;
                    // console.log(user,"user");
                    // console.log(user.uid,"userid");
                    // updateDoc(docRef, { user: [...data[0].user,user.photoURL] });
                    setYou(String(user.photoURL));
                }
            }).catch((error) => {
                console.error(error);
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                // console.error(errorCode);
                // console.error(errorMessage);
                // console.error(email);
                // The AuthCredential type that was used.
                //const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }, []);


    //トランプの型
    type cardType = {
        image: string,
        images: { png: string, svg: string },
        value: string,
        suit: string,
        code: string,
    }

    //コレクションの型
    type collectionData = {
        gameFlag: boolean,
        sumNum: number,
        deck_id: string,
        card: cardType,
        cardList: cardType[],
        user: string,
        yourPoint: number,
        enemySumNum: number,
        enemyCard: cardType,
        enemyCardList: cardType[],
        enemyPoint: number,
    }

    const [data, setData] = useState<collectionData[]>([
        {
            gameFlag: false,
            sumNum: 0,
            deck_id: "",
            card: {
                image: "",
                images: { png: "", svg: "" },
                value: "",
                suit: "",
                code: ""
            },
            cardList: [],
            user: "",
            yourPoint: 0,
            enemySumNum: 0,
            enemyCard: {
                image: "",
                images: { png: "", svg: "" },
                value: "",
                suit: "",
                code: ""
            },
            enemyCardList: [],
            enemyPoint: 0,
        }],
    );

    //モーダルの開閉用
    const [open, setOpen] = useState<boolean>(false);

    //ルールのモーダル開閉用
    const [openRule, setOpenRule] = useState<boolean>(false);

    //現在の認証者
    const [you, setYou] = useState<string | undefined>(undefined);

    //カードスタンドの場合
    const [stand, setStand] = useState<boolean>(false);


    //コレクションの情報取得
    const q = collection(db, "kadai_20220807");
    const docRef = doc(q, "wN2seu8I8fQ2RZaBRfSh");

    //ゲーム終了時処理
    const gameClose = (): void => {
        setOpen(false)
    }

    //トランプの数の総和が特定の値を超えたらゲーム終了のモーダルをオープンする。
    useEffect(
        () => {
            if (data[0].sumNum > 22 || stand === true) {

                setOpen(true)

                //コレクションの値の初期化
                updateDoc(docRef, { gameFlag: false });
                updateDoc(docRef, { cardList: [] });
                updateDoc(docRef, { deck_id: "" });
                updateDoc(docRef, {
                    card: {
                        image: "",
                        images: { png: "", svg: "" },
                        value: "",
                        suit: "",
                        code: ""
                    }
                });
                updateDoc(docRef, { yourPoint: data[0].sumNum });
                updateDoc(docRef, { sumNum: 0 });

                setStand(false);
            }
        }, [data[0].sumNum, stand]
    )

    //コレクションの値を画面と同期
    useEffect(() => {
        const q = query(collection(db, "kadai_20220807"));

        const unsub = onSnapshot(q, (QuerySnapshot) => {
            setData(
                QuerySnapshot.docs.map((doc) => ({
                    gameFlag: doc.data().gameFlag,
                    sumNum: doc.data().sumNum,
                    deck_id: doc.data().deck_id,
                    card: doc.data().card,
                    cardList: doc.data().cardList,
                    user: doc.data().user,
                    yourPoint: doc.data().yourPoint,
                    enemySumNum: doc.data().enemySumNum,
                    enemyCard: doc.data().enemyCard,
                    enemyCardList: doc.data().enemyCardList,
                    enemyPoint: doc.data().enemyPoint,
                }))
            );
        });
        return () => unsub();
    }, []);


    const gameStart = async () => {

        //相手のデータ初期化
        updateDoc(docRef, { enemyCardList: [] });
        updateDoc(docRef, { enemySumNum: 0 });
        updateDoc(docRef, {
            enemyCard: {
                image: "",
                images: { png: "", svg: "" },
                value: "",
                suit: "",
                code: ""
            }
        });


        //トランプのシャッフル
        const response = await fetch(
            "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2"
        ).then((res) => res.json())
            .then((data) => {
                updateDoc(docRef, { deck_id: data.deck_id });
            });

        //ゲーム開始フラグをtrueにする。
        updateDoc(docRef, { gameFlag: true });

        // await hitCard();
    }

    const hitCard = async () => {


        //カードを一枚引く
        const response = await fetch(
            `https://deckofcardsapi.com/api/deck/${data[0].deck_id}/draw/?count=1`
        ).then((res) => res.json())
            .then((cdata) => {
                updateDoc(docRef, { card: cdata.cards[0] });

                updateDoc(docRef, { cardList: [...data[0].cardList, cdata.cards[0]] });

                //今カードを引いたユーザの情報を格納する。認証が無い場合は名無しを入れる。
                if (you !== undefined) {
                    updateDoc(docRef, { user: you });
                } else {
                    updateDoc(docRef, { user: "nanashi" });
                }

                //レスポンスの数値変換をする
                let tmpNumber: number = 0;
                switch (cdata.cards[0].value) {
                    case "ACE":
                        tmpNumber = 11;
                        break;
                    case "JACK":
                        tmpNumber = 10
                        break;
                    case "QUEEN":
                        tmpNumber = 10
                        break;
                    case "KING":
                        tmpNumber = 10
                        break;
                    default:
                        tmpNumber = Number(cdata.cards[0].value);
                }
                updateDoc(docRef, { sumNum: (data[0].sumNum + tmpNumber) });
            });

        // //相手のターン
        const enemyTurn = async () => {
            await new Promise(() => setTimeout(enemyHitCard, 1000));
        }
        enemyTurn();

    }


    //相手が引くカード
    const enemyHitCard = async () => {

        //カードを一枚引く
        const response = await fetch(
            `https://deckofcardsapi.com/api/deck/${data[0].deck_id}/draw/?count=1`
        ).then((res) => res.json())
            .then((cdata) => {
                updateDoc(docRef, { enemyCard: cdata.cards[0] });

                updateDoc(docRef, { enemyCardList: [...data[0].enemyCardList, cdata.cards[0]] });

                //レスポンスの数値変換をする
                let tmpNumber: number = 0;
                switch (cdata.cards[0].value) {
                    case "ACE":
                        tmpNumber = 11;
                        break;
                    case "JACK":
                        tmpNumber = 10
                        break;
                    case "QUEEN":
                        tmpNumber = 10
                        break;
                    case "KING":
                        tmpNumber = 10
                        break;
                    default:
                        tmpNumber = Number(cdata.cards[0].value);
                }
                updateDoc(docRef, { enemySumNum: (data[0].enemySumNum + tmpNumber) });
            });
    }




    return (
        <Layout>
            <div className={styles.App}>
                <h2>Black Jack</h2>
                <div className={styles.allCardContainer}></div>
                {(data[0].gameFlag === false) ? "" : <p>自分が引いたカード</p>}
                {/* 今までに引いたカードをすべて表示 */}
                <div className={styles.cardListContainer}>
                    {data[0].cardList.map((card, index) => (
                        <div key={index} className={styles.card}>
                            <img className={styles.card_img} src={card.image} />
                        </div>
                    ))}
                </div>
                {/* 今までに引いたカードをすべて表示 */}
                {/* <div className="enemyCardListContainer">
        {data[0].enemyCardList.map((card, index) => (
          <div key={index} className="card">
            <img src={card.image} />
          </div>
        ))}
      </div> */}

                {(data[0].gameFlag === false) && (
                    // ゲーム開始前の表示
                    <Button variant="contained" onClick={gameStart} style={{ marginRight: '5px' }}>Game Start</Button>)}
                {(data[0].gameFlag === true) && (
                    //ゲーム開始後の表示
                    <Button variant="contained" color="success" onClick={hitCard} style={{ marginRight: '5px' }}>Hit Card</Button>
                )}
                {(data[0].gameFlag === true) && (
                    //ゲーム開始後の表示
                    <Button variant="contained" color="success" onClick={() => setStand(true)} style={{ marginRight: '5px' }}>Stand Card</Button>
                )}
                <Button className={styles.rule} variant="contained" onClick={() => setOpenRule(true)}>Rule</Button>

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
                            minWidth: '500px',
                            maxHeight: '70%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <Box textAlign="center">
                            <DialogTitle>
                                {(data[0].gameFlag === true) && ("Please close the modal to go to next game...")}
                                {/* 勝敗の条件分岐 */}
                                {(data[0].gameFlag === false && data[0].enemySumNum > 21 && data[0].yourPoint > 21) && ("Draw...")}
                                {(data[0].gameFlag === false && data[0].enemySumNum > 21 && data[0].yourPoint <= 21) && ("You win!")}
                                {(data[0].gameFlag === false && data[0].enemySumNum <= 21 && data[0].yourPoint > 21) && ("You lose...")}
                                {(data[0].gameFlag === false && data[0].enemySumNum <= 21 && data[0].yourPoint <= 21 && data[0].enemySumNum < data[0].yourPoint) && ("You win!")}
                                {(data[0].gameFlag === false && data[0].enemySumNum <= 21 && data[0].yourPoint <= 21 && data[0].enemySumNum > data[0].yourPoint) && ("You lose...")}

                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    {/* 次のゲームが始まっている場合は下記を表示する */}
                                    {(data[0].gameFlag === true) ? "Next game has already started..." : ""}

                                    {/* 次のゲームが始まっていない場合にスコア結果を表示する。 */}
                                    {(data[0].gameFlag === false) &&
                                        // 認証していないメンバの場合は名無しでそうでない場合は認証者のアイコン表示
                                        (<span>{((data[0].user === "nanashi") ? "名無し" :
                                            <img src={data[0].user} style={{ height: '30px', width: '30px' }} />)} {data[0].yourPoint}Points!</span>)}
                                </DialogContentText>
                                <DialogContentText>
                                    {/* 次のゲームが始まっていない場合にスコア結果を表示する。 */}
                                    {(data[0].gameFlag === false) &&
                                        // 認証していないメンバの場合は名無しでそうでない場合は認証者のアイコン表示
                                        (<span>Enemy: {data[0].enemySumNum}Points!</span>)}
                                </DialogContentText>
                            </DialogContent>
                        </Box>
                    </Paper>
                </Modal>

                {/* ルール表示モーダル */}
                <Modal
                    open={openRule}
                    onClose={() => setOpenRule(false)}
                >
                    <Paper
                        style={{
                            left: '50%',
                            top: '50%',
                            position: 'absolute',
                            maxWidth: '100%',
                            minWidth: '900px',
                            maxHeight: '70%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <Box textAlign="center">
                            <DialogTitle>■Black Jack ルール説明</DialogTitle>
                            <DialogContent>
                                <DialogContentText textAlign="left">・player(自分)とCPUの2人対戦ゲーム</DialogContentText>
                                <DialogContentText textAlign="left">・カードを引き、playerとCPUでカードの総和を21により近づけた方が勝利。</DialogContentText>
                                <DialogContentText textAlign="left">・「HIT CARD」でカードを引くことができる。</DialogContentText>
                                <DialogContentText textAlign="left">・「STAND CARD」で引くのをやめることができる。</DialogContentText>
                                <DialogContentText textAlign="left">・「HIT CARD」と「STAND CARD」をうまく使い、カードの総和を21に近づけること。</DialogContentText>
                                <DialogContentText textAlign="left">・ただし、得点の総和が22点を超えると負け</DialogContentText>
                                <DialogContentText textAlign="left">・Aは11点、J,Q,Kは10点扱いとなる。</DialogContentText>
                                <DialogContentText textAlign="left">(※本来のBlack JackのルールだとAは11点扱いか1点扱いかplayerが選べるが、本ゲームでは11点固定となる。)</DialogContentText>

                                {/* 下記は改行用 */}
                                <DialogContentText>　</DialogContentText>
                            </DialogContent>
                        </Box>
                    </Paper>
                </Modal>


            </div >
        </Layout>
    )
}

export default BlackJack
