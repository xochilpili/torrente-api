#!/usr/bin/env node
import commander, { Option, requiredOption } from 'commander';
import { ITorrentSearchOptions, IGenericTorrent } from '@paranoids/torrente-types';
import { TorrentController } from './controllers/torrent.controller';

commander
	.version('2.0.0', '-v, --version')
	.usage('[OPTIONS]...')
	.addOption(new Option('-p, --provider <provider>', 'Use only this provider').choices(['1337x', 'ThePirateBay', 'Limetorrents', 'Eztv', 'Rarbg', 'Yts']))
	.requiredOption('-s, --search <string>', 'Query string to search')
	.option('-r, --releases [groups...]', 'Filtering by this ReleaseGroups')
	.option('-y --year <number>', 'Filtering by Year')
	.option('-q, --quality [qualities...]', 'Filtering by Qualities')
	.option('--season <number>', 'Season for a tvShow')
	.option('--episode <number>', 'Episode for a tvShow')
	.option('--limit <number>', 'Torrents limit')
	.option('--pretty', 'Using stringify')
	.parse(process.argv);

const options = commander.opts();

const searchOptions: ITorrentSearchOptions = {
	...(options.provider && { provider: [options.provider] }),
	...(options.releases && { releases: options.releases }),
	...(options.quality && { quality: options.quality }),
	...(options.year && { year: options.year }),
	...(options.season && { season: options.season }),
	...(options.episode && { episode: options.episode }),
	...(options.season &&
		options.episode && {
		query: `${options.search} s${options.season.toString().padStart(2, '0')}e${options.episode.toString().padStart(2, '0')}`,
	}),
	...(options.season && !options.episode && { query: `${options.search} s${options.season.toString().padStart(2, '0')}` }),
	...(!options.season && !options.episode && options.search && { query: options.search }),
	...(options.limit && { torrentLimit: options.limit }),
	category: 'All',
};

// eslint-disable-next-line no-console
console.log(
	`Searching torrents for ${options.search}${options.provider ? ' provider : ' + options.provider : ''}${options.season ? ' season: ' + options.season : ''}${
		options.episode ? ' episode: ' + options.episode : ''
	}`
);

(async () => {
	const results: IGenericTorrent[] = await TorrentController.search(searchOptions);
	// eslint-disable-next-line no-console
	console.log(JSON.stringify(results, null, 4));
})();
