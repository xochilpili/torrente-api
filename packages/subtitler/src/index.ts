import { Providers } from './provider.config';
import { IGenericSubtitle } from '@paranoids/types';
import OpenSubsController from './controllers/opensubs.controller';
import Subdivx from './controllers/subdivx.controller';
import Subscene from './controllers/subscene.controller';

const subdivx: Subdivx = new Subdivx(Providers.filter((provider) => provider.name === 'subdivx')[0]);
const subscene: Subscene = new Subscene(Providers.filter((provider) => provider.name === 'subscene')[0]);
const opensubs: OpenSubsController = new OpenSubsController(
	Providers.filter((provider) => provider.name === 'opensubtitles')[0]
);

// testing
(async () => {
	const subd: IGenericSubtitle[] = await subdivx.searchSubtitles({ query: 'vikings s01e01' });
	const subs: IGenericSubtitle[] = await subscene.searchSubtitles({ query: 'vikings s01e01' });
	// eslint-disable-next-line no-console
	// console.log(JSON.stringify(subtitles, null, 4));
	const opensub: IGenericSubtitle[] = await opensubs.searchSubtitles({
		query: 'vikings',
		episode: 1,
		season: 1,
		lang: ['spa'],
	});
	// eslint-disable-next-line no-console
	console.log([...subd, ...subs, ...opensub]);
})();
