jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');
import * as queryString from 'querystring';
import { IGenericSubtitle, IOptionHeaders, ISubtitlerProvider } from '@paranoids/types';
import { Subscene } from '../../../src/controllers/subscene.controller';
import { Providers } from '../../../src/provider.config';

describe('Subscene Controller', () => {
	let subsceneProvider: ISubtitlerProvider;
	let subsceneController: Subscene;
	beforeAll(() => {
		subsceneProvider = Providers.filter((p) => p.name === 'Subscene')[0];
		subsceneController = new Subscene(subsceneProvider);

		fetch.mockImplementation((...args) => {
			const [url, ...rest] = args;
			let htmlMarkup: string;
			switch (url) {
				case 'https://subscene.com/subtitles/searchbytitle':
					if (rest[0].body === 'query=fake&l=') {
						htmlMarkup =
							'<html><body><div class="search-result"><ul><li><div class="title"><a href="http://fake.com/fake">fake</a></div></li></ul></div></body></html>';
					} else {
						htmlMarkup =
							'<html><body><div class="changed"><ul><li><div class="changed-title"><a href="http://fake.com/fake">fake</a></div></li></ul></div></body></html>';
					}
					return Promise.resolve(new Response(htmlMarkup));
				case 'http://fake.com/fake':
					return Promise.resolve(
						new Response(
							'<html><body><table><tr><td class="a1"><a href="http://fake2.com/the_subElement"><span>Spanish</span><span>fake-filename.yify.webrip.srt</span></a></td></tr></table></body></html>'
						)
					);
				case 'http://fake2.com/the_subElement':
					return Promise.resolve(
						new Response(
							'<html><body><div class="download"><a href="http://fake3.com/the_fucking_file"></a></div></body></html>'
						)
					);
			}
		});
	});

	it('should return valid subtitles for subscene', async () => {
		const data = await subsceneController.searchSubtitles({ query: 'fake' });
		const expected: IGenericSubtitle[] = [
			{
				link: 'http://fake3.com/the_fucking_file',
				provider: 'subscene',
				quality: ['webrip'],
				releases: ['yify'],
				title: 'fake-filename.yify.webrip.srt',
				downLink: 'http://fake3.com/the_fucking_file',
				type: 'movie',
				year: null,
				lang: 'Spanish',
				filename: 'fake-filename.yify.webrip.srt',
			} as IGenericSubtitle,
		];
		const expectedHeader: IOptionHeaders = {
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
				cookie: `LanguageFilter=${
					Array.isArray(subsceneProvider.lang) ? subsceneProvider.lang.join(',') : subsceneProvider.lang
				}`,
			},
			method: 'POST',
			body: `query=${queryString.escape('fake')}&l=`,
		};
		expect(fetch).toHaveBeenCalledTimes(3);
		expect(fetch).toHaveBeenNthCalledWith(1, 'https://subscene.com/subtitles/searchbytitle', expectedHeader);
		expect(fetch).toHaveBeenNthCalledWith(2, 'http://fake.com/fake', expectedHeader);
		expect(fetch).toHaveBeenNthCalledWith(3, 'http://fake2.com/the_subElement', expectedHeader);
		expect(data).toStrictEqual(expected);
	});

	it('should return empty subtitles when html markup changed', async () => {
		const data = await subsceneController.searchSubtitles({ query: 'changed' });
		expect(data).toStrictEqual([]);
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});
});
