import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBn7uZ4ZcohR0K4uJAj3ZrPehkLAfMLK6w",
  authDomain: "recipeapp-317810.firebaseapp.com",
  projectId: "recipeapp-317810",
  storageBucket: "recipeapp-317810.appspot.com",
  messagingSenderId: "964386836741",
  appId: "1:964386836741:web:336fb7440cf4450c07276c",
  measurementId: "G-47SX16SP56",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
