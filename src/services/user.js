import request from '@/utils/request';
import { auth } from '@/utils/firebaseConfig';

export async function query() {
	return request('/api/users');
}

export async function queryCurrent() {
	if (auth.currentUser) {
		const { displayName, email, phoneNumber, photoURL, uid, refreshToken } = auth.currentUser;
		return { displayName, email, phoneNumber, photoURL, uid, refreshToken };
	}

	return null;
} // Cargar el usuario activo

export async function queryNotices() {
	return request('/api/notices');
}
