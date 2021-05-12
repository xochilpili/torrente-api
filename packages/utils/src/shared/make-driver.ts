import fetch, { Response } from 'node-fetch';
import { IOptionHeaders } from '@paranoids/torrente-types';
import { URL } from 'url';

export const baseHeaders: IOptionHeaders = {
	headers: {
		'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36',
	},
};

export const makeDriver = (opts: IOptionHeaders) => {
	return function driver(context: { url: string }, callback: (error: string, body: string) => void): void {
		const url = new URL(context.url);
		fetch(url, opts)
			.then((response: Response) => {
				response.arrayBuffer().then((buffer) => {
					const textDecoder = new TextDecoder('iso-8859-1');
					const correctedResponse = textDecoder.decode(buffer);
					// eslint-disable-next-line no-console
					// console.log('status', response.status, correctedResponse);
					callback(null, correctedResponse);
				});
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.log(error, context.url, opts);
			});
	};
};
