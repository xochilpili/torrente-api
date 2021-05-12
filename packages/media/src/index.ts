import { MediaManager } from './media-manager';
import { IMediaItem, IMediaSearchOptions, Provider } from '@paranoids/torrente-types';

(async () => {
	const mediaManager = new MediaManager();
	mediaManager.deactiveProvider(['300mbfilms', 'festivals', 'subAdictos', 'fMovies']);
	const results: IMediaItem[] = await mediaManager.getReleases({
		providerCategory: 'hbo',
		page: 1,
		excludeGenres: ['musical', 'documentary', 'documental', 'music', 'horror', 'terror', 'reality'],
		includeTorrent: false,
		onlySubtitled: true,
		torrentSearchOptions: {
			provider: [Provider.leetx, Provider.limeTorrents, Provider.rarbg, Provider.yify, Provider.kickAss],
			category: 'All',
			torrentLimit: 2,
		},
		subtitlerSearchOptions: {
			provider: 'subdivx',
			lang: ['spa'],
		},
	} as IMediaSearchOptions);
	// eslint-disable-next-line no-console
	console.log(JSON.stringify(results, null, 4));
})();
