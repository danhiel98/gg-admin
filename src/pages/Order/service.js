import { app, firestore, storage } from '@/utils/firebaseConfig';
let ref = firestore.collection('orders');

export async function queryOrder(params) {
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

	return response;
}
export async function removeOrder(params) {

}
export async function addOrder(params) {

}
export async function updateOrder(params) {

}
