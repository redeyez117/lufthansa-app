import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import 'firebase/compat/database'

const app = firebase.initializeApp({
  apiKey: "AIzaSyCfXzgrhb44DKsmx9TkdChmzUN39_mI5n4",
  authDomain: "lufthansa-app-1a0e7.firebaseapp.com",
  projectId: "lufthansa-app-1a0e7",
  storageBucket: "lufthansa-app-1a0e7.appspot.com",
  messagingSenderId: "816629675824",
  appId: "1:816629675824:web:57690cf012b3411986baf5"
})

export const auth = app.auth()
export const database = app.database()
export default app
