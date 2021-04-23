export interface ISubSceneItemScraper {
	provider: 'subscene';
	title: string;
	link: string;
}

export interface ISubSceneSubItem {
	type?: 'movie' | 'serie' | 'sport';
	link: string;
	lang: string;
	filename: string;
	downLink: string;
}
export interface ISubSceneItem extends ISubSceneItemScraper {
	links: ISubSceneSubItem[];
}

export interface ISubSceneSubtitle extends ISubSceneItemScraper, ISubSceneSubItem {
	releases?: string[];
	quality?: string[];
	size?: string;
	year?: string;
	season?: number;
	episode?: number;
}
