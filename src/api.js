import { firebase_app } from "./config.js";

export const loadData = async (name = '') => {
	const db = firebase_app.firestore();
	if (name === '') {
		const snap = await db.collection('users_aitu').get();
		return snap.docs.map(d => d.data());
	}
	return await db.collection('users_aitu').doc(name).get();
}
export const setData = async (name, data) => {
	const db = firebase_app.firestore();
	return await db.collection('users_aitu').doc(name).set(data);
}