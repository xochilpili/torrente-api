import { Request, Response } from 'express';
import { ISearchOptions, IGenericSubtitle, ISubtitlerProvider } from '@paranoids/types';
import { SubtitlerManager } from './../../subtitler-manager';

export async function GetProvidersRoute(req: Request, res: Response): Promise<Response<ISubtitlerProvider[]>> {
	const subtitlerManager = new SubtitlerManager();
	const providers: ISubtitlerProvider[] = await subtitlerManager.getActiveProviders();
	return res.status(200).json(providers);
}

export async function GetSubtitlesRoute(req: Request, res: Response): Promise<Response<IGenericSubtitle[]>> {
	const subtitlerManager = new SubtitlerManager();
	const searchOptions: ISearchOptions = req.body;
	const subtitles: IGenericSubtitle[] = await subtitlerManager.getSubtitles({
		...searchOptions,
		...(searchOptions.season &&
			searchOptions.episode && {
			query: `${searchOptions.query} s${searchOptions.season
				.toString()
				.padStart(2, '0')}e${searchOptions.episode.toString().padStart(2, '0')}`,
		}),
		...(searchOptions.season &&
			!searchOptions.episode && { query: `${searchOptions.query} s${searchOptions.season.toString().padStart(2, '0')}` }),
		...(!searchOptions.season && !searchOptions.episode && searchOptions.query && { query: searchOptions.query }),
	});
	req.log.info({ searchOptions }, 'Searching subtitles');
	return res.status(200).json(subtitles);
}
