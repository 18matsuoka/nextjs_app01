//Firebase ver9 compliant (modular)
import { initializeApp } from "firebase/app";
import { getAuth,Auth  } from "firebase/auth";
import { getFirestore,Firestore  } from "firebase/firestore";


const firebaseApp = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
});

//Firebase ver9 compliant (modular)
export const auth: Auth  = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);