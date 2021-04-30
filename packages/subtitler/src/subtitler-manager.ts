import { Providers } from './provider.config';
import { IController, LoaderType, ISubtitlerProvider, IGenericSubtitle, ISearchOptions } from '@paranoids/types';
import * as Controllers from './controllers';
export class SubtitlerManager {
	private _providers: ISubtitlerProvider[];
	private _controllers: IController[];

	constructor() {
		this._providers = Providers;
		this._controllers = this.loadAllControllers(Controllers);
	}

	public getActiveProviders(): ISubtitlerProvider[] {
		return this._providers.filter((provider) => provider.active);
	}

	public activateProvider(provider: 'subdivx' | 'subscene' | 'opensubtitles'): void {
		this._providers.filter((p) => {
			if (p.name.toLowerCase() === provider.toLowerCase()) p.active = true;
		});
	}
	public deactiveProvider(provider: 'subdivx' | 'subscene' | 'opensubtitles'): void {
		this._providers.filter((p) => {
			if (p.name.toLowerCase() === provider.toLowerCase()) p.active = false;
		});
	}

	public async getSubtitles(searchOptions: ISearchOptions): Promise<IGenericSubtitle[]> {
		const subtitlers: IGenericSubtitle[][] = await Promise.all(
			this._controllers
				.filter((controller) =>
					searchOptions.provider
						? controller.constructor.name.toLowerCase() === searchOptions.provider.toLowerCase()
						: this.getActiveProviders().some(
							(provider) => controller.constructor.name.toLowerCase() === provider.name.toLowerCase()
						  )
				)
				.map(async (controller) => await controller.searchSubtitles(searchOptions))
		);
		const postFilters = this.subFilter(searchOptions, subtitlers.flat(3));
		return postFilters;
	}

	private subFilter(searchOptions: ISearchOptions, subtitles: IGenericSubtitle[]): IGenericSubtitle[] {
		let filtered: IGenericSubtitle[] = subtitles;
		if (searchOptions.season) {
			filtered = filtered.filter((subtitle) => subtitle.season === +searchOptions.season);
		}

		if (searchOptions.episode) {
			filtered = filtered.filter((subtitle) => subtitle.episode === +searchOptions.episode);
		}

		if (searchOptions.releases) {
			filtered = filtered.filter((subtitle) =>
				searchOptions.releases.some((r) => subtitle.releases.indexOf(r.toLowerCase().trim()) >= 0)
			);
		}

		if (searchOptions.year) {
			filtered = filtered.filter((subtitle) => subtitle.year === searchOptions.year);
		}
		if (searchOptions.quality) {
			filtered = filtered.filter((subtitle) =>
				searchOptions.quality.some((q) => subtitle.quality.indexOf(q.toLowerCase().trim()) >= 0)
			);
		}
		return filtered;
	}

	private loadAllControllers(controllers: any): IController[] {
		try {
			const plugins = this.loadControllers(controllers);
			return plugins;
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	}

	private loadControllers(controller: Map<string, IController>): IController[] {
		return Object.values(controller)
			.map(
				(__class) =>
					new __class(
						this.getActiveProviders().filter(
							(provider) => provider.name.toLowerCase() === __class.name.toString().toLowerCase()
						)[0]
					)
			)
			.filter((value) => value.discriminator === LoaderType.DISCRIMINATOR_LOADER)
			.filter((__class) =>
				this.getActiveProviders().some(
					(provider) => __class.constructor.name.toString().toLowerCase() === provider.name.toLowerCase()
				)
			);
	}
}
