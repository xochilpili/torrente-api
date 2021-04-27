import { ISearchOptions, ISubtitlerProvider, IGenericSubtitle, IOpenSubsItem, IController, LoaderType } from '@paranoids/types';
import OS from 'opensubtitles-api';
import Parsers from '../utils/parsers';

export class OpenSubtitles implements IController {
	discriminator = LoaderType.DISCRIMINATOR_LOADER;
	private _provider: ISubtitlerProvider;
	private _osClient: OS;
	constructor(provider: ISubtitlerProvider) {
		this._provider = provider;
		this._osClient = new OS({
			useragent: this._provider.userAgent,
			username: this._provider.username,
			password: this._provider.password,
			ssl: true,
		});
	}

	public async searchSubtitles(searchOptions: ISearchOptions): Promise<IGenericSubtitle[]> {
		await this._osClient.login();
		const results: IOpenSubsItem[] = await this._osClient.search({
			...searchOptions,
			sublanguageid: searchOptions.lang.join(','),
			limit: 'all', // best | number
		});
		const items: IOpenSubsItem[] = Object.values(results).flat(1);
		return items.map((item: IOpenSubsItem) =>
			Parsers.parseSubtitle({ ...item, provider: 'opensubtitles', title: item.filename, link: item.utf8 })
		);
	}
}
