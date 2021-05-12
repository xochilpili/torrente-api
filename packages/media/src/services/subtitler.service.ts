import { ISearchOptions, IGenericSubtitle } from '@paranoids/torrente-types';
import fetch, { Response } from 'node-fetch';

export class SubtitlerService {
	public static async getSubtitles(searchOptions: ISearchOptions): Promise<IGenericSubtitle[]> {
		const response: Response = await fetch(`${process.env.SUBTITLER_URI}/search`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(searchOptions),
		});
		if (response.status !== 200) {
			// eslint-disable-next-line no-console
			console.log('error', await response.text());
		}
		const result = await response.json().catch(async (error) => {
			// eslint-disable-next-line no-console
			console.log(error, response);
		});
		return result;
	}
}
