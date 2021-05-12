import { Parsers } from '@paranoids/torrente-utils';
import { ITorrentSearchOptions, ITorrentItem, IGenericTorrent } from '@paranoids/torrente-types';
import TorrentSearchApi from 'torrent-search-api';

export class TorrentController {
	static async search(searchOptions: ITorrentSearchOptions): Promise<ITorrentItem[]> {
		if (searchOptions.provider && searchOptions.provider.length > 0) {
			searchOptions.provider.forEach((provider) => {
				TorrentSearchApi.enableProvider(provider);
			});
		} else {
			TorrentSearchApi.enablePublicProviders();
		}
		const results: ITorrentItem[] = await TorrentSearchApi.search(searchOptions.query, searchOptions.category, searchOptions.torrentLimit);
		const torrents: IGenericTorrent[] = await TorrentController.parseProcess(results);
		return TorrentController.postFilter(searchOptions, torrents);
	}

	private static async parseProcess(items: ITorrentItem[]): Promise<IGenericTorrent[]> {
		const subItems: IGenericTorrent[] = items.map((item: ITorrentItem) => Parsers.parseTorrent(item));
		const withMagnet: IGenericTorrent[] = await Promise.all(
			subItems.map(async (item: IGenericTorrent) => {
				const magnet = await TorrentController.getMagnet(item);
				return { ...item, magnet };
			})
		);
		return withMagnet;
	}

	private static postFilter(searchOptions: ITorrentSearchOptions, items: IGenericTorrent[]): IGenericTorrent[] {
		let filtered: IGenericTorrent[] = items;
		if (searchOptions.releases) {
			filtered = filtered
				.filter((item: IGenericTorrent) => item.releases !== null)
				.filter((item: IGenericTorrent) => searchOptions.releases.some((r) => item.releases.indexOf(r.toLowerCase().trim()) >= 0));
		}
		if (searchOptions.quality) {
			filtered = filtered.filter((item: IGenericTorrent) => searchOptions.quality.some((q) => item.quality.indexOf(q.toLowerCase().trim()) >= 0));
		}
		return filtered;
	}

	private static async getMagnet(item: IGenericTorrent): Promise<string> {
		return await TorrentSearchApi.getMagnet(item);
	}
	static activeProviders(): any[] {
		return TorrentSearchApi.getActiveProviders();
	}
}
