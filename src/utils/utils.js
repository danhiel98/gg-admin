import { parse } from 'querystring';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);
export const isAntDesignPro = () => {
	if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
		return true;
	}

	return window.location.hostname === 'preview.pro.ant.design';
};

export const isAntDesignProOrDev = () => {
	const { NODE_ENV } = process.env;

	if (NODE_ENV === 'development') {
		return true;
	}

	return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const zeroPad = (num, places) => String(num).padStart(places, '0');

export const fileExtension = (filename) => filename.substr(filename.lastIndexOf('.'));

export const isEmpty = (obj) => JSON.stringify(obj) === JSON.stringify({});

export const stringToHTML = (str) => {
	var parser = new DOMParser();

	return parser.parseFromString(str, 'text/html').body;
};
