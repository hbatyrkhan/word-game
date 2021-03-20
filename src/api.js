import { firebase_app } from "./config.js";

export const loadData = async (name = '') => {
	const db = firebase_app.firestore();
	if (name === '')
		return await db.collection('users_aitu').get();
	return await db.collection('users_aitu').doc(name).get();
}
export const setData = async (name, data) => {
	const db = firebase_app.firestore();
	return await db.collection('users_aitu').doc(name).set(data);
}