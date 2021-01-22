import request from '@/utils/request';
import { auth } from '@/utils/firebaseConfig';

export async function query() {
	return request('/api/users');
}

export async function queryCurrent() {
	console.log(auth.currentUser)
	return auth.currentUser;
	// return request('/api/currentUser');
} // Cargar el usuario activo

export async function queryNotices() {
	return request('/api/notices');
}
