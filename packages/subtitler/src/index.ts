import { SubtitlerManager } from './subtitler-manager';

// testing

(async () => {
	const m = new SubtitlerManager();
	// m.deactiveProvider('subscene');
	const s = await m.getSubtitles({
		query: 'vikings',
		season: 1,
		lang: ['spa'],
		releases: ['CtrlHD'],
	});
	// eslint-disable-next-line no-console
	console.log(JSON.stringify(s, null, 4));
})();
