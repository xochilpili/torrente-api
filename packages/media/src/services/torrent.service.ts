import fetch, { Response } from 'node-fetch';
import { IGenericTorrent, ITorrentSearchOptions } from '@paranoids/torrente-types';

export class TorrentService {
	static async getTorrents(searchOptions: ITorrentSearchOptions): Promise<IGenericTorrent[]> {
		const response: Response = await fetch(`${process.env.TORRENT_URL}/search`, {
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
