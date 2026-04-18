// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1iIugKHoiY1knaIME579Tfz0yys1MSFo",
    authDomain: "todo-avjit.firebaseapp.com",
    projectId: "todo-avjit",
    storageBucket: "todo-avjit.firebasestorage.app",
    messagingSenderId: "114024788416",
    appId: "1:114024788416:web:ee04f9f023b7359514d825",
    measurementId: "G-72864D4L0C"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.log('The current browser does not support persistence.');
        }
    });
