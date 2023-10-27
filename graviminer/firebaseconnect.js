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
        // .then((res) => {
        // let user = res.user;
        // window.uuid = user.uid;
        // })
        .then(callbackFn)
}

function googleSignOut(callbackFn) {
    signOut(auth).then(callbackFn);
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

    let userDocRef = doc(db, 'users', window.uuid)
    getDoc(userDocRef)
        .then(doc => doc.data())
        .then(doc => {
            let currentGraviCoins = (doc['graviCoins'] === undefined) ? 0 : doc['graviCoins'];
            let multiplier = 1;
            if ((level >= 5) && (level <= 7)) {
                multiplier = 2;
            } else if ((level >= 8)) {
                multiplier = 3
            }
            doc['graviCoins'] = currentGraviCoins + multiplier * score;
            return doc;
        })
        .then(data => setDoc(userDocRef, data))
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

function addHOFMessage(message, callbackFnSuccess, callbackFnFail) {
    let userDocRef = doc(db, 'users', window.uuid)
    getDoc(userDocRef)
        .then(doc => doc.data())
        .then(doc => {
            let currentGraviCoins = (doc['graviCoins'] === undefined) ? 0 : doc['graviCoins'];
            if (currentGraviCoins > 100) {
                doc['graviCoins'] = currentGraviCoins - 100;
            } else {
                doc = "not enough coins";
            }
            return doc;
        })
        .then(data => {
            if (data === "not enough coins") {
                callbackFnFail();
            } else {
                setDoc(userDocRef, data)
                let hofCollectionRef = collection(db, 'halloffame');
                addDoc(hofCollectionRef, {
                    uuid: window.uuid,
                    message: message
                }).then(() => callbackFnSuccess());
            }
        })

}

function fetchHOF() {
    let hofDocRef = collection(db, 'halloffame');
    return getDocs(hofDocRef)
        .then(rows => {
            let rowsData = [];
            rows.forEach(row => {
                rowsData.push({
                    uuid: row.data().uuid,
                    message: row.data().message
                })
            })

            return rowsData;
        })
}

function getUsername(uuid) {
    let userDocRef = doc(db, 'users', uuid)
    return getDoc(userDocRef).then(row => row.data()['displayName'])
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.uuid = user.uid;
    } else {
        window.uuid = null;
    }
});

window.getCurrentUser = getCurrentUser;
window.googleSignIn = googleSignIn;
window.googleSignOut = googleSignOut;
window.setUsernameForCurrentUser = setUsernameForCurrentUser;
window.addGameScore = addGameScore;
window.fetchLeaderBoard = fetchLeaderBoard;
window.getUsername = getUsername;
window.addHOFMessage = addHOFMessage;
window.fetchHOF = fetchHOF;