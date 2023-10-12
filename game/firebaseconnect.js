import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, getDocs, addDoc, collection, query, where } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"

const firebaseConfig = {

    apiKey: "AIzaSyBFSDDy0-2eU-TRuyeyrJxcG3mePrZrwmU",
    authDomain: "graviminer.firebaseapp.com",
    projectId: "graviminer",
    storageBucket: "graviminer.appspot.com",
    messagingSenderId: "896608575071",
    appId: "1:896608575071:web:2f7f65076eee805c8d85ea",

};

let app = initializeApp(firebaseConfig);
let auth = getAuth(app);
let db = getFirestore(app);
let provider = new GoogleAuthProvider();

function googleSignIn(callbackFn) {
    signInWithPopup(auth, provider)
        .then((res) => {
            let user = res.user;
            window.uuid = user.uid;
        })
        .then(callbackFn)
}

function getCurrentUser(callbackFn) {
    let userDocRef = doc(db, `users/${window.uuid}`)
    getDoc(userDocRef)
        .then(doc => doc.data())
        .then(data => callbackFn(data))
}

function setUsernameForCurrentUser(username, callbackFn) {
    let userDocRef = doc(db, 'users', window.uuid);
    setDoc(userDocRef, { 'displayName': username })
        .then(callbackFn)
}

function addGameScore(level, score) {
    let leaderboardDocRef = doc(db, 'leaderboard', window.uuid)
    getDoc(leaderboardDocRef)
        .then(doc => doc.data())
        .then(data => {
            if (data === undefined) {
                data = {}
            }
            if (data[level] === undefined) {
                data[level] = [];
            }
            data[level].push(score);
            return data;
        })
        .then(data => setDoc(leaderboardDocRef, data))
}

function fetchLeaderBoard(level) {
    let leaderboardCollectionRef = collection(db, 'leaderboard');
    return getDocs(leaderboardCollectionRef)
        .then(rows => {
            let uuidScores = {};
            rows.forEach(row => {
                let levelScores = row.data()[level];
                if (levelScores !== undefined) {
                    uuidScores[row.id] = Math.max(...levelScores);
                }
            });
            return uuidScores;
        })
}

function getUsername(uuid) {
    let userDocRef = doc(db, 'users', uuid)
    return getDoc(userDocRef).then(row => row.data()['displayName'])
}

window.getCurrentUser = getCurrentUser;
window.googleSignIn = googleSignIn;
window.setUsernameForCurrentUser = setUsernameForCurrentUser;
window.addGameScore = addGameScore;
window.fetchLeaderBoard = fetchLeaderBoard;
window.getUsername = getUsername;