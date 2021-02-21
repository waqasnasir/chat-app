import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import firestore from 'firebase/firestore'
const settings = {timestampsInSnapshots: true};
const config = {
  apiKey: "AIzaSyDHFyIe0M3vG05pcjZwERPqSp0b1hkWkDY",
  projectId: 'testproject-cb080',
  authDomain: "testproject-cb080.firebaseapp.com",
  databaseURL: "https://testproject-cb080.firebaseio.com"
};

firebase.initializeApp(config);
firebase.firestore().settings(settings);

export const auth = firebase.auth;
export const db = firebase.database();