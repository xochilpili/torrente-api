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
	name: 'subdivx' | 'subscene';
	baseUrl: string;
	itemSelector: string;
	itemsSelector: IItemsSelector;
}
