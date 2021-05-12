import { Request, Response } from 'express';
import { TorrentController } from './../../controllers/torrent.controller';
import { ITorrentItem, ITorrentSearchOptions } from '@paranoids/torrente-types';

export async function GetTorrentRoute(req: Request, res: Response): Promise<Response<ITorrentItem[]>> {
	const searchOptions: ITorrentSearchOptions = req.body;
	// req.log.info({ searchOptions }, 'Searching Torrents');
	// eslint-disable-next-line no-console
	console.log(`Search ${searchOptions.query}, ${searchOptions.provider}`);
	try {
		const results: ITorrentItem[] = await TorrentController.search(searchOptions);
		return res.status(200).json(results);
	} catch (error) {
		return res.status(500).json({ error });
	}
}
