import { ISearchOptions, IGenericSubtitle } from './subtitler';
export enum LoaderType {
	DISCRIMINATOR_LOADER = 'subtitler',
}
export interface IController {
	discriminator: LoaderType.DISCRIMINATOR_LOADER;
	searchSubtitles(searchOptions: ISearchOptions): Promise<IGenericSubtitle[]>;
}
