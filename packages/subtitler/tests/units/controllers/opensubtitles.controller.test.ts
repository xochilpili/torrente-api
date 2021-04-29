import { IOpenSubsItem } from '@paranoids/types/src/models/opensubs';
import { IGenericSubtitle } from '@paranoids/types';
import { OpenSubtitles } from '../../../src/controllers/opensubs.controller';
import { Providers } from '../../../src/provider.config';
import OS from 'opensubtitles-api';

describe('OpenSubtitles Controller Test', () => {
	let mockOSLogin;
	let mockOSSearch;
	beforeAll(() => {
		mockOSLogin = jest.spyOn(OS.prototype, 'login').mockResolvedValue(1);
		mockOSSearch = jest.spyOn(OS.prototype, 'search').mockResolvedValue([
			{
				provider: 'opensubtitles',
				type: 'movie',
				url: 'fake-url.com',
				langcode: 'spa',
				downloads: 3,
				title: 'flaca',
				filename: 'fake.s01e01.HDTV.ctrlhd.mp4',
				utf8: 'fake-filename.str',
				link: 'fake-url.com/the_fucking_file',
			} as IOpenSubsItem,
		]);
	});

	it('should return valid subtitles', async () => {
		const openSubsProvider = Providers.filter((p) => p.name === 'OpenSubtitles')[0];
		const opensubs = new OpenSubtitles(openSubsProvider);
		const data: IGenericSubtitle[] = await opensubs.searchSubtitles({ query: 'fake', lang: ['spa'] });
		const expected: IGenericSubtitle[] = [
			{
				title: 'fake.s01e01.HDTV.ctrlhd.mp4',
				type: 'serie',
				url: 'fake-url.com',
				utf8: 'fake-filename.str',
				downloads: 3,
				season: 1,
				episode: 1,
				year: null,
				releases: ['ctrlhd'],
				quality: ['hdtv'],
				filename: 'fake.s01e01.HDTV.ctrlhd.mp4',
				langcode: 'spa',
				link: 'fake-filename.str',
				provider: 'opensubtitles',
			} as any,
		];
		expect(mockOSLogin).toHaveBeenCalledTimes(1);
		expect(mockOSSearch).toHaveBeenCalledTimes(1);
		expect(mockOSSearch).toHaveBeenCalledWith({ lang: ['spa'], limit: 'all', query: 'fake', sublanguageid: 'spa' });
		expect(data).toStrictEqual(expected);
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});
});
