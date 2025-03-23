import { initializeApp } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
} from "firebase/auth";
import {
	getFirestore,
	collection,
	addDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";

// Firebase config (Replace with your own details)
const firebaseConfig = {
	apiKey: "AIzaSyDuUjwgu8U0EORuvS-1I4wT0YrU9RXieOw",
	authDomain: "briefy-92e74.firebaseapp.com",
	projectId: "briefy-92e74",
	storageBucket: "briefy-92e74.firebasestorage.app",
	messagingSenderId: "765414819374",
	appId: "1:765414819374:web:8c8bddc9aac9f5d677c1bf",
	measurementId: "G-Q35L7149WV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Sign-in
const provider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
	try {
		const result = await signInWithPopup(auth, provider);
		return result.user;
	} catch (error) {
		console.error(error);
	}
};

// Email/Password Signup
const signUpWithEmail = async (email, password) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		return userCredential.user;
	} catch (error) {
		console.error("Signup Error:", error.message);
		throw error;
	}
};

// Email/Password Login
const signInWithEmail = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		return userCredential.user;
	} catch (error) {
		console.error("Login Error:", error.message);
		throw error;
	}
};

// Logout
const logout = () => signOut(auth);

// Firestore: Save Meeting
const saveMeeting = async (userId, title, transcript, summary) => {
	try {
		await addDoc(collection(db, "meetings"), {
			userId,
			title,
			transcript,
			summary,
			createdAt: new Date(),
		});
	} catch (error) {
		console.error("Error saving meeting:", error);
	}
};

// Firestore: Get User's Meetings
const getMeetings = async (userId) => {
	try {
		const q = query(collection(db, "meetings"), where("userId", "==", userId));
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	} catch (error) {
		console.error("Error fetching meetings:", error);
	}
};

export {
	auth,
	signInWithGoogle,
	signUpWithEmail,
	signInWithEmail,
	logout,
	saveMeeting,
	getMeetings,
	db,
	onAuthStateChanged, // ✅ Added this to fix your error!
};
