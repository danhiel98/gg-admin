import request from '@/utils/request';
import { auth } from '@/utils/firebaseConfig';

export async function accountLogin(params) {
	let result;

	await auth
		.signInWithEmailAndPassword(params.userName, params.password)
		.then(data => {
			result = {
				status: 'ok',
				currentAuthority: 'user',
			}
		})
		.catch(error => {
			result = {
				status: 'error',
				message: error.message,
				currentAuthority: 'guest',
			}
		})

	return result;

	// return request('/api/login/account', {
	// 	method: 'POST',
	// 	data: params,
	// });
}
export async function getFakeCaptcha(mobile) {
	return request(`/api/login/captcha?mobile=${mobile}`);
}
