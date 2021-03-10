import request from '@/utils/request';
import { app, firestore, storage } from '@/utils/firebaseConfig';
const DOCUMENT = 'customers';
let orderRef = firestore.collection('orders');

export async function queryAvailableDelete(record_key) {
	let ref = firestore.collection(DOCUMENT);
	let result = false;

	return new Promise((resolve, reject) => {
		ref.doc(record_key)
			.get()
			.then(async (doc) => {
				if (doc.exists) {
					await orderRef
						.where('customer_ref', '==', doc.ref)
						.limitToLast()
						.get()
						.then((qs) => {
							if (qs.size == 0) {
								result = true;
							}
						});
				}
				resolve(result);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export async function queryCustomerSelect() {
	let ref = firestore.collection(DOCUMENT);
	let data = [];

	await ref
		.where('deleted', '==', false)
		.get()
		.then((qs) => {
			qs.forEach((doc) => {
				data.push({ label: doc.data().name, value: doc.id, ref: doc.ref});
			});
		})
		.catch((error) => error);

	return data;
}

export async function queryCustomer(params) {
	let ref = firestore.collection(DOCUMENT);
	let customers = request('/api/customer', {
		params,
	});

	let response = {
		current: params.current,
		pageSize: params.pageSize,
		total: 0,
		data: [],
		success: true,
	};

	await ref
		.where('deleted', '==', false)
		.get()
		.then((qs) => {
			response.total = qs.size;
			qs.forEach((doc) => {
				response.data.push({ key: doc.id, ...doc.data() });
			});
		});

	return response;
}

export async function removeCustomer(record) {
	let ref = firestore.collection(DOCUMENT);
	return new Promise((resolve, reject) => {
		ref.doc(record.key)
			.update({ deleted: true })
			.then(() => {
				resolve(record);
			})
			.catch((error) => {
				reject(error);
			});
	});
	// return request('/api/customer', {
	// 	method: 'POST',
	// 	data: { ...params, method: 'delete' },
	// });
}

export async function addCustomer(params) {
	let ref = firestore.collection(DOCUMENT);
	let now = app.firestore.FieldValue.serverTimestamp();

	return new Promise((resolve, reject) => {
		ref.add({
			created_at: now,
			deleted: false,
			orders_amount: 0,
			total_paid: 0,
			updated_at: now,
			user_id: null, // Revisar
			...params,
		})
			.then((docRef) => {
				resolve(docRef);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export async function updateCustomer(params, record) {
	let ref = firestore.collection(DOCUMENT);
	return new Promise((resolve, reject) => {
		ref.doc(record.key)
			.update(params)
			.then(() => {
				resolve(record);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
