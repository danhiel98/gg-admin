import { app, auth } from '@/utils/firebaseConfig';

export async function accountLogin(params) {
	let result;

	await app
		.auth()
		.setPersistence(app.auth.Auth.Persistence.LOCAL)
		.then(async () => {
			await auth
				.signInWithEmailAndPassword(params.userName, params.password)
				.then((data) => {
					result = {
						status: 'ok',
						currentAuthority: 'user',
					};
				})
				.catch((error) => {
					result = {
						status: 'error',
						message: error.message,
						currentAuthority: 'guest',
					};
				});
		})
		.catch((error) => {
			result = {
				status: 'error',
				message: error.message,
				currentAuthority: 'guest',
			};
		})

	return result;
}
