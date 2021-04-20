import { ISubtitlerProvider } from '@paranoids/types';
export const Providers: ISubtitlerProvider[] = [
	{
		type: 'scraper',
		name: 'subdivx',
		baseUrl: '',
		itemSelector: '',
		itemsSelector: {
			titleSelector: '',
			linkPageSelector: '',
			descSelector: '',
			downLinkSelector: '',
		},
	},
	{
		type: 'scraper',
		name: 'subscene',
		baseUrl: 'https://subscene.com/subtitles/searchbytitle',
		itemSelector: '.search-result ul li',
		itemsSelector: {
			titleSelector: '.title',
			linkPageSelector: '.title a@href',
			totalSelector: '.subtle',
			subItemSelector: 'table tr',
			subItemLinkPageSelector: '.a1 a@href',
			subItemLangSelector: '.a1 a span',
			subItemFilenameSelector: '.a1 a span+span',
			downLinkSelector: '.download a@href',
		},
	},
];
