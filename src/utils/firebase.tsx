// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyC2zfqDrzuDdxzqy-XCVk-BrUi_IiU_oO8",
  authDomain: "test-app-59add.firebaseapp.com",
  projectId: "test-app-59add",
  storageBucket: "test-app-59add.appspot.com",
  messagingSenderId: "737225043536",
  appId: "1:737225043536:web:df3a0cf64acac595582b55",
  measurementId: "G-8VNK2JSZ7N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Get a list of cities from your database
export async function getList(db: any) {
  const todoCol = collection(db, 'list');  
  const todoSnapshot = await getDocs(todoCol);
  // todoSnapshot.docs.set(todoSnapshot.docs.map((todo)=>todo.id));
  const todoList = todoSnapshot.docs.map(doc => {
    return {...doc.data(), id: doc.id};
    });
  return todoList;
}