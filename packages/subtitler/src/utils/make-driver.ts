import fetch from 'node-fetch';
import { IOptionHeaders } from '@paranoids/types';
export const baseHeaders: IOptionHeaders = {
	headers: {
		'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36',
	},
};

export const makeDriver = (opts: IOptionHeaders) => {
	return function driver(context: { url: string }, callback: (error: string, body: string) => void): void {
		const url = context.url;
		fetch(url, opts).then((response) => {
			response.text().then((body) => callback(null, body));
		});
	};
};
