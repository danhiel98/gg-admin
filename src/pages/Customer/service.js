import request from '@/utils/request';
import { app, firestore, storage } from '@/utils/firebaseConfig';
let ref = firestore.collection('customers');

export async function queryCustomer(params) {

	// let customers = request('/api/customer', {
	// 	params,
	// });

	let response = {
		current: params.current,
		pageSize: params.pageSize,
		total: 0,
		data: [],
		success: true
	};

	await ref.get().then((qs) => {
		response.total = qs.size;
		qs.forEach(doc => {
			response.data.push({ key: doc.id, ...doc.data() })
		})
	});

	// console.log(response);
	// customers.then((r) => console.log(r));
	return response;
}
export async function removeCustomer(params) {
	return request('/api/customer', {
		method: 'POST',
		data: { ...params, method: 'delete' },
	});
}
export async function addCustomer(params) {
	let now = app.firestore.FieldValue.serverTimestamp();

	return new Promise((resolve, reject) => {
		ref.add({
			created_at: now,
			orders_amount: 0,
			total_paid: 0,
			updated_at: now,
			user_id: null, // Revisar
			...params
		})
		.then((docRef) => {
			resolve(docRef);
		})
		.catch((error) => {
			reject(error);
		});
	})
}
export async function updateCustomer(params, record) {
	return new Promise((resolve, reject) => {
		console.log(record.key, params);

		ref.doc(record.key)
		.update(params)
		.then(() => {
			resolve('¡Registro actualizado correctamente!')
		})
		.catch((error) => {
			reject(error)
		})
	})
}
