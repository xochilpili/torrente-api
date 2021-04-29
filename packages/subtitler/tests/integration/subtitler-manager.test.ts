jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');
jest.mock('opensubtitles-api');
import OS from 'opensubtitles-api';
import * as queryString from 'querystring';
import { IOpenSubsItem, ISearchOptions, IGenericSubtitle, IOptionHeaders } from '@paranoids/types';
import { Providers } from '../../src/provider.config';
import { baseHeaders } from '../../src/utils/make-driver';
import { SubtitlerManager } from './../../src/subtitler-manager';

describe('Subtitler Manager Integration Tests', () => {
	let mockOSLogin;
	let mockOSSearch;
	let manager: SubtitlerManager;
	beforeAll(() => {
		fetch.mockImplementation((...args) => {
			const [url, ...rest] = args;
			switch (url) {
				case 'https://www.subdivx.com/index.php?buscar=fake&accion=5&masdesc=&subtitulos=1&realiza_b=1':
					return Promise.resolve(
						new Response(
							`<html><body>
								<div id="contenedor_izq">
									<div id="menu_detalle_buscador">
										<a class="titulo_menu_izq" href="http://fake.com/subdivx">Subtitulos de fake.s01e01</a>
									</div>
									<div id="buscador_detalle">
										<div id="buscador_detalle_sub">version avs hdtv</div>
									</div>
								</div>
							</body></html>`
						)
					);
				case 'http://fake.com/subdivx':
					return Promise.resolve(
						new Response(
							'<html><body><div id="detalle_datos"><center><h1><a class="link1" href="http://fake.com/the_fucking_file"></a></h1></center></div></body></html>'
						)
					);
				case 'https://subscene.com/subtitles/searchbytitle':
					return Promise.resolve(
						new Response(
							'<html><body><div class="search-result"><ul><li><div class="title"><a href="http://fake.com/subscene">fake</a></div></li></ul></div></body></html>'
						)
					);
				case 'http://fake.com/subscene':
					return Promise.resolve(
						new Response(
							'<html><body><table><tr><td class="a1"><a href="http://fake2.com/the_subElement"><span>Spanish</span><span>fake-filename.2021.webrip.yify.srt</span></a></td></tr></table></body></html>'
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
		manager = new SubtitlerManager();
	});

	it('should have load controllers', () => {
		expect(manager['_controllers'].length).toBe(3);
	});

	it('should deactive a provider', () => {
		manager.deactiveProvider('opensubtitles');
		expect(manager.getActiveProviders().length).toBe(2);
	});

	it('should activate a provider', () => {
		manager.activateProvider('opensubtitles');
		expect(manager.getActiveProviders().length).toBe(3);
	});

	it('should return valid subtitles with provider opensubtitles', async () => {
		const searchOptions: ISearchOptions = {
			provider: 'opensubtitles',
			query: 'fake',
			lang: ['spa'],
			season: 1,
			episode: 1,
			releases: ['ctrlhd'],
			quality: ['hdtv'],
		};
		const expected: IGenericSubtitle[] = [
			{
				episode: 1,
				filename: 'fake.s01e01.HDTV.ctrlhd.mp4',
				link: 'fake-filename.str',
				provider: 'opensubtitles',
				quality: ['hdtv'],
				releases: ['ctrlhd'],
				season: 1,
				title: 'fake.s01e01.HDTV.ctrlhd.mp4',
				type: 'serie',
				year: null,
				url: 'fake-url.com',
				utf8: 'fake-filename.str',
				langcode: 'spa',
				downloads: 3,
			} as IGenericSubtitle,
		];
		const result = await manager.getSubtitles(searchOptions);
		expect(result).toStrictEqual(expected);
		expect(mockOSLogin).toHaveBeenCalledTimes(1);
		expect(mockOSSearch).toHaveBeenCalledTimes(1);
		expect(mockOSSearch).toHaveBeenCalledWith({
			...searchOptions,
			limit: 'all',
			sublanguageid: searchOptions.lang.join(','),
		});
	});

	it('should return valid subtitles with provider subscene', async () => {
		const subsceneProvider = Providers.filter((p) => p.name === 'Subscene')[0];
		const searchOptions: ISearchOptions = {
			provider: 'subscene',
			query: 'fake',
			lang: ['spa'],
			releases: ['yify'],
			quality: ['webrip'],
		};
		const expected: IGenericSubtitle[] = [
			{
				downLink: 'http://fake3.com/the_fucking_file',
				filename: 'fake-filename.2021.webrip.yify.srt',
				lang: 'Spanish',
				link: 'http://fake3.com/the_fucking_file',
				provider: 'subscene',
				quality: ['webrip'],
				releases: ['yify'],
				title: 'fake-filename.2021.webrip.yify.srt',
				type: 'movie',
				year: '2021',
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

		const subtitles = await manager.getSubtitles(searchOptions);
		expect(subtitles).toStrictEqual(expected);
		expect(fetch).toHaveBeenCalledTimes(3);
		expect(fetch).toHaveBeenNthCalledWith(1, 'https://subscene.com/subtitles/searchbytitle', expectedHeader);
		expect(fetch).toHaveBeenNthCalledWith(2, 'http://fake.com/subscene', expectedHeader);
		expect(fetch).toHaveBeenNthCalledWith(3, 'http://fake2.com/the_subElement', expectedHeader);
	});

	it('should return valid subtitles with provider subdivx', async () => {
		const subdivxProvider = Providers.filter((s) => s.name === 'Subdivx')[0];
		const searchOptions: ISearchOptions = {
			provider: 'subdivx',
			query: 'fake',
		};
		const expected: IGenericSubtitle[] = [
			{
				desc: 'version avs hdtv',
				episode: 1,
				link: 'http://fake.com/the_fucking_file',
				provider: 'subdivx',
				quality: ['hdtv'],
				releases: ['avs'],
				season: 1,
				title: 'fake.s01e01',
				type: 'serie',
				year: null,
			} as IGenericSubtitle,
		];
		const result = await manager.getSubtitles(searchOptions);
		expect(result).toStrictEqual(expected);
		expect(fetch).toHaveBeenCalledTimes(5); //accumulative cos mock
		expect(fetch).toHaveBeenNthCalledWith(
			4,
			subdivxProvider.baseUrl + queryString.escape('fake') + '&accion=5&masdesc=&subtitulos=1&realiza_b=1',
			baseHeaders
		);
		expect(fetch).toHaveBeenNthCalledWith(5, 'http://fake.com/subdivx', baseHeaders);
	});

	it('should return valid subtitles all providers', async () => {
		const searchOptions: ISearchOptions = {
			query: 'fake',
			lang: ['spa'],
		};
		const expected: IGenericSubtitle[] = [
			{
				desc: 'version avs hdtv',
				episode: 1,
				link: 'http://fake.com/the_fucking_file',
				provider: 'subdivx',
				quality: ['hdtv'],
				releases: ['avs'],
				season: 1,
				title: 'fake.s01e01',
				type: 'serie',
				year: null,
			} as IGenericSubtitle,
			{
				downLink: 'http://fake3.com/the_fucking_file',
				filename: 'fake-filename.2021.webrip.yify.srt',
				lang: 'Spanish',
				link: 'http://fake3.com/the_fucking_file',
				provider: 'subscene',
				quality: ['webrip'],
				releases: ['yify'],
				title: 'fake-filename.2021.webrip.yify.srt',
				type: 'movie',
				year: '2021',
			} as IGenericSubtitle,
			{
				episode: 1,
				filename: 'fake.s01e01.HDTV.ctrlhd.mp4',
				link: 'fake-filename.str',
				provider: 'opensubtitles',
				quality: ['hdtv'],
				releases: ['ctrlhd'],
				season: 1,
				title: 'fake.s01e01.HDTV.ctrlhd.mp4',
				type: 'serie',
				year: null,
				url: 'fake-url.com',
				utf8: 'fake-filename.str',
				langcode: 'spa',
				downloads: 3,
			} as IGenericSubtitle,
		];

		const result = await manager.getSubtitles(searchOptions);
		expect(result).toStrictEqual(expected);
	});

	it('should return filtered subtitles by releases', async () => {
		const searchOptions: ISearchOptions = {
			query: 'fake',
			lang: ['spa'],
			releases: ['yify', 'ctrlhd'],
		};
		const expected: IGenericSubtitle[] = [
			{
				provider: 'subscene',
				type: 'movie',
				title: 'fake-filename.2021.webrip.yify.srt',
				downLink: 'http://fake3.com/the_fucking_file',
				filename: 'fake-filename.2021.webrip.yify.srt',
				lang: 'Spanish',
				link: 'http://fake3.com/the_fucking_file',
				year: '2021',
				quality: ['webrip'],
				releases: ['yify'],
			} as IGenericSubtitle,
			{
				episode: 1,
				filename: 'fake.s01e01.HDTV.ctrlhd.mp4',
				link: 'fake-filename.str',
				provider: 'opensubtitles',
				quality: ['hdtv'],
				releases: ['ctrlhd'],
				season: 1,
				title: 'fake.s01e01.HDTV.ctrlhd.mp4',
				type: 'serie',
				year: null,
				url: 'fake-url.com',
				utf8: 'fake-filename.str',
				langcode: 'spa',
				downloads: 3,
			} as IGenericSubtitle,
		];
		const data: IGenericSubtitle[] = await manager.getSubtitles(searchOptions);
		expect(data).toStrictEqual(expected);
	});

	it('should return filtered subttiles by year', async () => {
		const searchOptions: ISearchOptions = {
			query: 'fake',
			lang: ['spa'],
			year: '2021',
		};
		const expected: IGenericSubtitle[] = [
			{
				provider: 'subscene',
				type: 'movie',
				title: 'fake-filename.2021.webrip.yify.srt',
				downLink: 'http://fake3.com/the_fucking_file',
				filename: 'fake-filename.2021.webrip.yify.srt',
				lang: 'Spanish',
				link: 'http://fake3.com/the_fucking_file',
				year: '2021',
				quality: ['webrip'],
				releases: ['yify'],
			} as IGenericSubtitle,
		];
		const data: IGenericSubtitle[] = await manager.getSubtitles(searchOptions);
		expect(data).toStrictEqual(expected);
	});

	it('should return filtered subttiles by quality and releases', async () => {
		const searchOptions: ISearchOptions = {
			query: 'fake',
			lang: ['spa'],
			quality: ['hdtv'],
			releases: ['avs'],
		};
		const expected: IGenericSubtitle[] = [
			{
				desc: 'version avs hdtv',
				episode: 1,
				link: 'http://fake.com/the_fucking_file',
				provider: 'subdivx',
				quality: ['hdtv'],
				releases: ['avs'],
				season: 1,
				title: 'fake.s01e01',
				type: 'serie',
				year: null,
			} as IGenericSubtitle,
		];
		const data: IGenericSubtitle[] = await manager.getSubtitles(searchOptions);
		expect(data).toStrictEqual(expected);
	});

	afterAll(() => {
		jest.resetAllMocks();
	});
});
