import request from '@/utils/request';

export async function queryCustomer(params) {
	return request('/api/customer', {
		params,
	});
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
