import request from '@/utils/request';
import { firestore, storage } from '@/utils/firebaseConfig';
let ref = firestore.collection('customers');

export async function queryCustomer(params) {
	let customers = request('/api/customer', {
		params,
	});

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
			// const { name, address, phone_numbers, user_id } = doc.data();
			response.data.push({ key: doc.id, ...doc.data() })
		})
	});

	// console.log(params);
	console.log(response);
	customers.then((r) => console.log(r));
	return response;
}
export async function removeCustomer(params) {
	return request('/api/customer', {
		method: 'POST',
		data: { ...params, method: 'delete' },
	});
}
export async function addCustomer(params) {
	return request('/api/customer', {
		method: 'POST',
		data: { ...params, method: 'post' },
	});
}
export async function updateCustomer(params) {
	return request('/api/customer', {
		method: 'POST',
		data: { ...params, method: 'update' },
	});
}
