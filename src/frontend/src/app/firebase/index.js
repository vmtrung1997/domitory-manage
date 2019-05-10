import firebase from 'firebase/app'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyBR7ks1d-0I5SLAJtZ6dNhqrLPv-4cKLJM",
    authDomain: "dormitory-d7223.firebaseapp.com",
    databaseURL: "https://dormitory-d7223.firebaseio.com",
    projectId: "dormitory-d7223",
    storageBucket: "dormitory-d7223.appspot.com",
    messagingSenderId: "669347713891",
    appId: "1:669347713891:web:48922461ea2af89e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const storage = firebase.storage();

  export {
      storage, firebase as default
  }