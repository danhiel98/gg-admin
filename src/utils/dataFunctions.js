export const currencyFormat = (num, locale = 'es-SV') =>
    new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
    }).format(num);

export const dateFromTimestamp = (timestamp, locale = 'es-SV', custom ) => {
	let options = custom ? custom : { year: 'numeric', month: 'short', day: 'numeric' }

	return timestamp.toDate().toLocaleDateString(locale, options);
}
