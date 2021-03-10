import { zeroPad } from '@/utils/utils';
import { app, firestore, storage } from '@/utils/firebaseConfig';
let ref = firestore.collection('orders');
let storageRef = storage.ref();
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

		ref.add(order).then((ref) => {
			if (attachments && attachments.images) {
				let images = attachments.images;
				let filename = undefined;
				let fileRef = undefined;
				let fullPath = undefined;

				console.log('Order added');
				images.forEach((img, idx) => {
					filename = `${ref.id} - ${zeroPad(idx + 1, 2)}${img.name.substr(img.name.lastIndexOf('.'))}`;
					fullPath = `images/${filename}`;
					fileRef = storageRef.child(fullPath);
					fileRef.put(img).then((snap) => {
						snap.ref.getDownloadURL().then(function(downloadURL) {
							console.log(downloadURL);
							ref.update({
								images: app.firestore.FieldValue.arrayUnion(downloadURL)
							})
						});
					});
				})
			}
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
