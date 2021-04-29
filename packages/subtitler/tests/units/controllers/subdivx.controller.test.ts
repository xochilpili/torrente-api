import { baseHeaders } from '../../../src/utils/make-driver';
jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');
import * as queryString from 'querystring';
import { ISubtitlerProvider, IGenericSubtitle } from '@paranoids/types';
import { Providers } from '../../../src/provider.config';
import { Subdivx } from '../../../src/controllers/subdivx.controller';

describe('Subdivx Controller test', () => {
	let subdivxProvider: ISubtitlerProvider;
	let subdivxController: Subdivx;
	beforeAll(() => {
		subdivxProvider = Providers.filter((s) => s.name === 'Subdivx')[0];
		subdivxController = new Subdivx(subdivxProvider);
		fetch.mockImplementation((...args) => {
			const [url, ...rest] = args;
			switch (url) {
				case 'https://www.subdivx.com/index.php?buscar=fake&accion=5&masdesc=&subtitulos=1&realiza_b=1':
					return Promise.resolve(
						new Response(
							'<html><body><div id="contenedor_izq"><div id="menu_detalle_buscador"><a class="titulo_menu_izq" href="http://fake.com/fake">flaca</a></div></div></body></html>'
						)
					);
				case 'http://fake.com/fake':
					return Promise.resolve(
						new Response(
							'<html><body><div id="detalle_datos"><center><h1><a class="link1" href="http://fake.com/the_fucking_file"></a></h1></center></div></body></html>'
						)
					);
				case 'https://www.subdivx.com/index.php?buscar=changed&accion=5&masdesc=&subtitulos=1&realiza_b=1':
					return Promise.resolve(
						new Response(
							'<html><body><div id="contenedor_izq"><div id="changed"><a class="changed" href="http://fake.com/fake">caca</a></div></div></body></html>'
						)
					);
			}
		});
	});

	it('should return valid subdivx subtitles', async () => {
		const data = await subdivxController.searchSubtitles({ query: 'fake' });
		const expected: IGenericSubtitle[] = [
			{
				link: 'http://fake.com/the_fucking_file',
				provider: 'subdivx',
				quality: [],
				releases: [],
				title: 'flaca',
				type: 'movie',
				year: null,
				desc: '',
			} as IGenericSubtitle,
		];
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenNthCalledWith(
			1,
			subdivxProvider.baseUrl + queryString.escape('fake') + '&accion=5&masdesc=&subtitulos=1&realiza_b=1',
			baseHeaders
		);
		expect(fetch).toHaveBeenNthCalledWith(2, 'http://fake.com/fake', baseHeaders);
		expect(data).toStrictEqual(expected);
	});

	it('should not return subtitles if html markup changes', async () => {
		const data = await subdivxController.searchSubtitles({ query: 'changed' });
		expect(data).toStrictEqual([]);
	});

	afterAll(() => {
		jest.resetAllMocks();
	});
});
