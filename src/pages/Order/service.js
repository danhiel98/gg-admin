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
export async function addOrder(params, attachments) {
	// ref.add(params)
	// .then(ref => {
	// 	console.log('Regstro insertado.');
	// 	console.log(`Document id: ${ref.id}`);
	// })
	// console.log('Parámetros/adjuntos:')
	// console.log(params);
	// console.log(attachments);
}
export async function updateOrder(params) {

}
