import { app, firestore, storage } from '@/utils/firebaseConfig';
let ref = firestore.collection('orders');
let customerRef = firestore.collection('customers');

export async function queryOrder(params) {
	let response = {
		current: params.current,
		pageSize: params.pageSize,
		total: 0,
		data: [],
		success: true,
	};

	await ref.get().then((qs) => {
		response.total = qs.size;
		qs.forEach((doc) => {
			response.data.push({ key: doc.id, ...doc.data() });
		});
	});

	return response;
}
export async function removeOrder(params) {}
export async function addOrder(params, attachments) {
	try {

		let {
			customer_id,
			deadline,
			description,
			first_payment,
			item_types,
			received_at,
			title,
			total,
		} = params;
		let customer = null;
		let status = 'pendiente';
		let remaining = total - first_payment;
		let now = app.firestore.Timestamp.now();

		deadline = new Date(deadline);
		received_at = new Date(received_at);

		await customerRef.doc(customer_id).get().then((doc) => (customer = doc.exists ? {...doc.data(), ref: doc.ref} : null));

		console.log(customer);

		let order = {
			customer_ref: customer.ref,
			customer: customer.name,
			created_at: now,
			deadline,
			description,
			first_payment,
			item_types,
			received_at,
			remaining,
			status,
			title,
			total,
			updated_at: now,
			user_id: null,
		}

		console.log(order);

		ref.add(order).then((ref) => {
			console.log('Regstro insertado.');
			console.log(`Document id: ${ref.id}`);
		});
	}
	catch (error) {
		console.log(error);
	}
	// console.log('Parámetros/adjuntos:')
	// console.log(params);
	// console.log(attachments);
}
export async function updateOrder(params) {}
