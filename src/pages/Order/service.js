import { zeroPad, fileExtension } from '@/utils/utils';
import { app, firestore, storage } from '@/utils/firebaseConfig';
const ref = firestore.collection('orders');
const storageRef = storage.ref();
const customerRef = firestore.collection('customers');

let orderRef = null;
let imagesToUpload = [];

export async function queryOrders(params) {
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

const uploadImage = {
	index: 0,
	filename: undefined,
	fullPath: undefined,
	fileRef: undefined,
	downloadURL: undefined,
	current: undefined,
	async next() {
		this.current = imagesToUpload[this.index];
		if (!this.current) return { value: undefined, done: true };

		this.filename = `${orderRef.id} - ${zeroPad(++this.index, 2)}${fileExtension(
			this.current.name,
		)}`;
		this.fullPath = `images/${this.filename}`;
		this.fileRef = storageRef.child(this.fullPath);

		await this.fileRef.put(this.current, { contentType: 'image/jpeg' }).then(async (snap) => {
			await this.fileRef.getDownloadURL().then((url) => {
				this.downloadURL = url;
			});
		});

		return {
			value: this.downloadURL,
			done: false,
		};
	},
};

export async function addOrder(params, attachments) {
	const {
		customer_id,
		deadline,
		description,
		first_payment,
		item_types,
		received_at,
		title,
		total,
	} = params;
	let status = 'pendiente';
	let remaining = total - first_payment;
	let now = app.firestore.Timestamp.now();
	let imageUrls = [];

	imagesToUpload = attachments.images;

	let order = {
		customer_ref: null /* customer.ref */,
		customer: null /* customer.name */,
		created_at: now,
		deadline: new Date(deadline),
		description,
		first_payment,
		item_types,
		received_at: new Date(received_at),
		remaining,
		status,
		title,
		total,
		updated_at: now,
		user_id: null,
	};

	return new Promise(async (resolve, reject) => {
		try {
			await customerRef
				.doc(customer_id)
				.get() // Obtener al cliente
				.then((doc) => {
					if (doc.exists) {
						order.customer_ref = doc.ref;
						order.customer = doc.data().name;
					}
				});

			await ref.add(order).then(async (ref) => {
				try {
					orderRef = ref;
					let item = await uploadImage.next();
					while (!item.done) {
						imageUrls.push(item.value);
						item = await uploadImage.next();
					}
				} catch (error) {
					console.log(error);
				}

				await ref.update({ images: imageUrls });
				
				resolve(`Pedido ingresado correctamente`);
			});
		} catch (err) {
			reject(err);
		}
	});
}

export async function getOrder(order_id) {
	await ref.get().then((qs) => {
		response.total = qs.size;
		qs.forEach((doc) => {
			response.data.push({ key: doc.id, ...doc.data() });
		});
	});

	return response;
}

export async function updateOrder(params) {}
