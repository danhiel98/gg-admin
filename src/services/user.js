import request from '@/utils/request';
import { auth } from '@/utils/firebaseConfig';

export async function query() {
	return request('/api/users');
}

export async function queryCurrent() {
	return request('/api/currentUser');
	// return auth.currentUser;
} // Cargar el usuario activo

export async function queryNotices() {
	return request('/api/notices');
}
