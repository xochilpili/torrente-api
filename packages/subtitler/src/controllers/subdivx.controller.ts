import {
	ISubtitlerProvider,
	ISubdivxItemScraper,
	ISubdivxItem,
	ISearchOptions,
	IGenericSubtitle,
	LoaderType,
	IController,
} from '@paranoids/types';
import xray from 'x-ray-scraper/Xray';
import * as queryString from 'querystring';
import { baseHeaders, makeDriver } from './../utils/make-driver';
import Parsers from '../utils/parsers';

export class Subdivx implements IController {
	discriminator = LoaderType.DISCRIMINATOR_LOADER;
	private _provider: ISubtitlerProvider;
	private _xray;
	constructor(provider: ISubtitlerProvider) {
		this._provider = provider;
		this.initializeCrawler();
	}

	private initializeCrawler() {
		this._xray = new xray();
		this._xray.driver(makeDriver(baseHeaders));
	}

	public async searchSubtitles(searchOptions: ISearchOptions): Promise<IGenericSubtitle[]> {
		const subtitles = await this.getSubtitles(searchOptions);
		return subtitles;
	}

	private async getSubtitles(searchOptions: ISearchOptions): Promise<IGenericSubtitle[]> {
		try {
			const results: ISubdivxItemScraper = await this._xray(
				`${this._provider.baseUrl}${queryString.escape(
					searchOptions.query
				)}&accion=5&masdesc=&subtitulos=1&realiza_b=1`,
				this._provider.itemSelector,
				{
					titles: [this._provider.itemsSelector.titleSelector],
					links: [this._provider.itemsSelector.linkPageSelector],
					descs: [this._provider.itemsSelector.descSelector],
				} as ISubdivxItemScraper
			);
			const postRequest: Promise<IGenericSubtitle>[] = await results.titles.map(async (title, index) => {
				const link = await this._xray(results.links[index], this._provider.itemsSelector.downLinkSelector);
				return Parsers.parseSubtitle({
					provider: 'subdivx',
					title,
					link,
					desc: results.descs[index] || '',
				} as ISubdivxItem);
			});
			const subtitles: IGenericSubtitle[] = await Promise.all(postRequest);
			return subtitles;
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log('subdivxError: ', error);
			throw error;
		}
	}
}
