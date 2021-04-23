import { ISearchOptions, ISubtitlerProvider, IGenericSubtitle, IOpenSubsItem } from '@paranoids/types';
import OS from 'opensubtitles-api';
import Parsers from '../utils/parsers';

export default class OpenSubsController {
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
		});
		const items: IOpenSubsItem[] = Object.values(results);
		return items.map((item: IOpenSubsItem) =>
			Parsers.parseSubtitle({ ...item, provider: 'opensubtitles', title: item.filename, link: item.utf8 })
		);
	}
}
