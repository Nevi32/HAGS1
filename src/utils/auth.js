import { auth } from '../lib/firebase-config.mjs';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user, message: 'Sign up successful' };
    } catch (error) {
        console.error("Error signing up:", error.message);
        return { success: false, message: error.message };
    }
};

export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user, message: 'Sign in successful' };
    } catch (error) {
        console.error("Error signing in:", error.message);
        return { success: false, message: 'Invalid email or password' };
    }
};

export const signOutUser = async () => {
    try {
        await signOut(auth);
        return { success: true, message: 'Sign out successful' };
    } catch (error) {
        console.error("Error signing out:", error.message);
        return { success: false, message: error.message };
    }
};

export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            callback({
                uid: user.uid,
                email: user.email,
            });
        } else {
            callback(null);
        }
    });
};