export interface IItemsSelector {
	titleSelector: string;
	linkPageSelector: string;
	downLinkSelector: string;
	descSelector?: string;
	totalSelector?: string;
	subItemSelector?: string;
	subItemLinkPageSelector?: string;
	subItemLangSelector?: string;
	subItemFilenameSelector?: string;
}
export interface ISubtitlerProvider {
	type: 'scraper' | 'json';
	name: 'Subdivx' | 'Subscene' | 'OpenSubtitles';
	active: boolean;
	baseUrl?: string;
	lang?: number[];
	itemSelector?: string;
	itemsSelector?: IItemsSelector;
	userAgent?: string;
	username?: string;
	password?: string;
}
