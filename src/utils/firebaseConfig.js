import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
	apiKey: 'AIzaSyA4tir2KhkBR5OzQV3dx16HoZug2aCXv0E',
	authDomain: 'grupo-garcia.firebaseapp.com',
	projectId: 'grupo-garcia',
	storageBucket: 'grupo-garcia.appspot.com',
	messagingSenderId: '825568347169',
	appId: '1:825568347169:web:06b1babc26e1b8728f0f60',
	measurementId: 'G-ZGMFPMCJT4',
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
