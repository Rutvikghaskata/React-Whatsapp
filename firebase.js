import firebase from "firebase";
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDIcLOkGjLWlqwzx1gUYrwkJEI6ZpdmJS8",
  authDomain: "whatsapp-nextjs-d751a.firebaseapp.com",
  projectId: "whatsapp-nextjs-d751a",
  storageBucket: "whatsapp-nextjs-d751a.appspot.com",
  messagingSenderId: "687401593439",
  appId: "1:687401593439:web:e7cdaa04dcf2f4868509ea",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
