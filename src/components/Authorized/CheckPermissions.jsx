import React from 'react';
import { CURRENT } from './renderAuthorize'; // eslint-disable-next-line import/no-cycle

import PromiseRender from './PromiseRender';

/**
 * 通用权限检查方法 Common check permissions method
 *
 * @param { 权限判定 | Permission judgment } authority
 * @param { 你的权限 | Your permission description } currentAuthority
 * @param { 通过的组件 | Passing components } target
 * @param { 未通过的组件 | no pass components } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
	// Retirement authority, return target;
	if (!authority) {
		return target;
	}

	if (Array.isArray(authority)) {
		if (Array.isArray(currentAuthority)) {
			if (currentAuthority.some((item) => authority.includes(item))) {
				return target;
			}
		} else if (authority.includes(currentAuthority)) {
			return target;
		}

		return Exception;
	} // string

	if (typeof authority === 'string') {
		if (Array.isArray(currentAuthority)) {
			if (currentAuthority.some((item) => authority === item)) {
				return target;
			}
		} else if (authority === currentAuthority) {
			return target;
		}

		return Exception;
	} // Promise

	if (authority instanceof Promise) {
		return <PromiseRender ok={target} error={Exception} promise={authority} />;
	} // Function

	if (typeof authority === 'function') {
		const bool = authority(currentAuthority); // Promise

		if (bool instanceof Promise) {
			return <PromiseRender ok={target} error={Exception} promise={bool} />;
		}

		if (bool) {
			return target;
		}

		return Exception;
	}

	throw new Error('unsupported parameters');
};

export { checkPermissions };

function check(authority, target, Exception) {
	return checkPermissions(authority, CURRENT, target, Exception);
}

export default check;
