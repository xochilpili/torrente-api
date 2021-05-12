import xray from 'x-ray-scraper/Xray';
import * as queryString from 'querystring';
import {
	ISubtitlerProvider,
	ISearchOptions,
	IGenericSubtitle,
	ISubSceneItemScraper,
	ISubSceneItem,
	ISubSceneSubItem,
	IOptionHeaders,
	ISubSceneSubtitle,
	LoaderType,
	IController,
} from '@paranoids/torrente-types';
import { Parsers, makeDriver, Helpers } from '@paranoids/torrente-utils';

export class Subscene implements IController {
	discriminator = LoaderType.DISCRIMINATOR_LOADER;
	private _provider: ISubtitlerProvider;
	private _xray: xray;

	constructor(provider: ISubtitlerProvider) {
		this._provider = provider;
		this._xray = new xray();
	}

	public async searchSubtitles(searchOptions: ISearchOptions): Promise<IGenericSubtitle[]> {
		const subtitles: IGenericSubtitle[] = await this.getSubtitles(searchOptions);
		return subtitles.flatMap((s) => s);
	}

	private async getSubtitles(searchOptions: ISearchOptions): Promise<IGenericSubtitle[]> {
		try {
			const langs = searchOptions.lang.map((lang) => {
				if (lang == 'spa') return 38;
				if (lang == 'eng') return 13;
			});
			const options: IOptionHeaders = {
				headers: {
					'content-type': 'application/x-www-form-urlencoded',
					cookie: `LanguageFilter=${Array.isArray(langs) ? langs.join(',') : this._provider.lang}`,
				},
				method: 'POST',
				body: `query=${queryString.escape(searchOptions.query)}&l=`,
			};
			this._xray.driver(makeDriver(options));
			const results: ISubSceneItemScraper[] = await this._xray(this._provider.baseUrl, this._provider.itemSelector, [
				{
					title: this._provider.itemsSelector.titleSelector,
					link: this._provider.itemsSelector.linkPageSelector,
				} as ISubSceneItemScraper,
			]);

			const subtitles = await this.delayProcess(results);
			return subtitles;
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log('stage 1 error', error);
			throw error;
		}
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async delayProcess(results: any[]): Promise<any[]> {
		return await results.reduce(async (accP, item: ISubSceneItemScraper) => {
			const acc: ISubSceneItem[] = await accP;
			await Helpers.sleep(2000);
			return [...acc, await this.subProcess(item)];
		}, []);
	}

	private async subProcess(subtitle: ISubSceneItemScraper): Promise<IGenericSubtitle[]> {
		const links: ISubSceneSubItem[] = await this._xray(subtitle.link, this._provider.itemsSelector.subItemSelector, [
			{
				link: this._provider.itemsSelector.subItemLinkPageSelector,
				lang: this._provider.itemsSelector.subItemLangSelector,
				filename: this._provider.itemsSelector.subItemFilenameSelector,
			},
		] as ISubSceneSubItem[]);

		if (links) {
			const sub = links.map(async (item: ISubSceneSubItem) => {
				const dwnLnk = await this._xray(item.link, this._provider.itemsSelector.downLinkSelector);
				// Generic Subtitle
				return Parsers.parseSubtitle({
					provider: 'subscene',
					title: item.filename,
					link: dwnLnk || '',
					lang: item.lang,
					filename: item.filename,
					downLink: dwnLnk,
				} as ISubSceneSubtitle);
			});
			const results: IGenericSubtitle[] = await Promise.all(sub);
			return results;
		}
	}
}
