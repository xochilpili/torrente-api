#!/usr/bin/env node
import commander, { Option } from 'commander';
import { ISearchOptions } from '@paranoids/types';
import { SubtitlerManager } from './subtitler-manager';

commander
	.version('2.0.0', '-v, --version')
	.usage('[OPTIONS]...')
	.addOption(
		new Option('-p, --provider <provider>', 'Use only this provider').choices(['subdivx', 'subscene', 'opensubtitles'])
	)
	.requiredOption('-s, --search <string>', 'Query string to search')
	.option('-r, --releases [groups...]', 'Filtering by this ReleaseGroups')
	.option('-y --year <number>', 'Filtering by Year')
	.option('-q, --quality [qualities...]', 'Filtering by Qualities')
	.option('--season <number>', 'Season for a tvShow')
	.option('--episode <number>', 'Episode for a tvShow')
	.option('--pretty', 'Using stringify')
	.parse(process.argv);

const options = commander.opts();

const searchOptions: ISearchOptions = {
	...(options.provider && { provider: options.provider }),
	...(options.releases && { releases: options.releases }),
	...(options.quality && { quality: options.quality }),
	...(options.year && { year: options.year }),
	...(options.season && { season: options.season }),
	...(options.episode && { episode: options.episode }),
	...(options.season &&
		options.episode && {
		query: `${options.search} s${options.season.toString().padStart(2, '0')}e${options.episode
			.toString()
			.padStart(2, '0')}`,
	}),
	...(options.season && !options.episode && { query: `${options.search} s${options.season.toString().padStart(2, '0')}` }),
	...(!options.season && !options.episode && options.search && { query: options.search }),
	...(options.provider && options.provider === 'opensubtitles' && { lang: ['spa'] }), // TODO: not hardcoded!
};

// eslint-disable-next-line no-console
console.log(
	`Searching subtitles for ${options.search}${options.provider ? ' provider : ' + options.provider : ''}${
		options.season ? ' season: ' + options.season : ''
	}${options.episode ? ' episode: ' + options.episode : ''}`
);

(async () => {
	const subtitlerManager = new SubtitlerManager();
	const subtitles = await subtitlerManager.getSubtitles(searchOptions);
	// eslint-disable-next-line no-console
	console.log(options.pretty ? JSON.stringify(subtitles, null, 4) : subtitles);
})();
