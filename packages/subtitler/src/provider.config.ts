import { ISubtitlerProvider } from '@paranoids/torrente-types';
export const Providers: ISubtitlerProvider[] = [
	{
		type: 'scraper',
		name: 'Subdivx',
		active: true,
		baseUrl: 'https://www.subdivx.com/index.php?buscar=',
		itemSelector: '#contenedor_izq',
		itemsSelector: {
			titleSelector: 'a.titulo_menu_izq',
			linkPageSelector: 'a.titulo_menu_izq@href',
			descSelector: '#buscador_detalle #buscador_detalle_sub',
			downLinkSelector: '#detalle_datos center h1 a@href',
		},
	},
	{
		type: 'scraper',
		name: 'Subscene',
		active: true,
		baseUrl: 'https://subscene.com/subtitles/searchbytitle',
		lang: [38],
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
	{
		type: 'json',
		name: 'OpenSubtitles',
		active: true,
		userAgent: '',
		username: '',
		password: '',
	},
];
