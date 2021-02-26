import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyD1IExZoyWUk59_9wKnHAYz6FPF9yCKnzk",
  authDomain: "chatapp-f1350.firebaseapp.com",
  projectId: "chatapp-f1350",
  storageBucket: "chatapp-f1350.appspot.com",
  messagingSenderId: "64093412799",
  appId: "1:64093412799:web:9344f3c8041a36ed17550a",
  measurementId: "G-FNKYQSS1JY",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();
// firebase.analytics();

export { auth, provider };
export default db;
