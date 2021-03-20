import firebase from "firebase";

export const firebaseConfig = {
	apiKey: "AIzaSyAJrNwmd6oK7H51QWLqwzFw-X72q_gGC4Q",
	authDomain: "hack-6c42a.firebaseapp.com",
	databaseURL: "https://hack-6c42a.firebaseio.com",
	projectId: "hack-6c42a",
	storageBucket: "hack-6c42a.appspot.com",
	messagingSenderId: "167776128050",
	appId: "1:167776128050:web:e14dce4f7ffd326672c02b"
};
// Initialize Firebase
export const firebase_app = firebase.initializeApp(firebaseConfig);
