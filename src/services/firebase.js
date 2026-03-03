import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyC85_aYP1rGrqpSrXm_mcx-Z18u_J1VKB0",
    authDomain: "qldh-c9e2e.firebaseapp.com",
    projectId: "qldh-c9e2e",
    storageBucket: "qldh-c9e2e.firebasestorage.app",
    messagingSenderId: "390569650766",
    appId: "1:390569650766:web:06b780ee8e1e4b5badf11f",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

/** Đăng nhập Google */
export async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
}

/** Đăng xuất */
export async function signOutUser() {
    await signOut(auth)
}

/** Lắng nghe trạng thái đăng nhập */
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback)
}

/** Lưu settings lên Firestore (mỗi user có doc riêng theo uid) */
export async function saveUserSettings(uid, settings) {
    await setDoc(doc(db, 'userSettings', uid), settings, { merge: true })
}

/** Đọc settings từ Firestore */
export async function loadUserSettings(uid) {
    const snap = await getDoc(doc(db, 'userSettings', uid))
    return snap.exists() ? snap.data() : null
}
