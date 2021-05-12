import { IMovieProvider } from '@paranoids/torrente-types';

export const Providers: IMovieProvider[] = [
	{
		name: '300mbfilms',
		type: 'scraper',
		active: true,
		url: 'https://www.300mbfilms.io',
		categorySelector: {
			all: '',
			movie: '/tag/mediafire-movies/',
			serie: '/tag/mediafire-tv-shows/',
		},
		pagePattern: '/page/',
		itemSelector: '.post',
		itemsSelector: {
			titleSelector: 'h2.title a',
			imageUrlSelector: '.entry img@src',
			rawTextSelector: 'p[@style="text-align: center;"]',
		},
		pagination: 'div#pagination a:last-child@href',
	},
	{
		name: 'fMovies',
		type: 'scraper',
		active: true,
		url: 'https://wvw.ffmovies.cc/',
		categorySelector: {
			all: 'release-year/' + new Date().getFullYear(),
			movie: 'movies/',
			serie: 'tv-series/',
			genres: 'genre/',
			country: 'country/',
		},
		pagePattern: 'page/',
		itemSelector: '.item',
		itemsSelector: {
			titleSelector: '.name',
			qualitySelector: '.quality',
			imageUrlSelector: '.poster img@src',
			subItemLinkSelector: '.poster@href',
			subItemsSelector: {
				rawTextSelector: '.info .row',
			},
		},
		pagination: '.pagination a@href',
	},
	{
		name: 'subAdictos',
		type: 'scraper',
		active: true,
		url: 'http://www.subadictos.net/foros/forumdisplay.php?f=',
		categorySelector: {
			all: '2',
			movie: '2', // estrenos
			serie: '42', // series terminadas
		},
		pagePattern: '&page=',
		itemSelector: 'li.threadbit',
		itemsSelector: {
			titleSelector: 'a.title',
			imageUrlSelector: '',
			countrySelector: 'img@alt',
			subItemLinkSelector: 'a.title@href',
			subItemsSelector: {
				imageUrlSelector: 'tr>td img@src',
				rawTextSelector: 'tr+tr+tr+tr+tr>td',
				imdbIdSelector: 'span.imdbRatingPlugin a@href',
				torrentSelector: 'tr+tr+tr+tr+tr+tr+tr+tr+tr a@href',
				subtitleSelector: 'tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr a@href',
			},
		},
		pagination: 'form.pagination span.selected+span a@href',
	},
	{
		name: 'festivals',
		type: 'scraper',
		active: true,
		url: 'https://www.filmaffinity.com/us/awards.php?award_id=',
		categorySelector: {
			festivalsUrlSelector: {
				// cannes: 'cannes&year=2021&cat_id=best_picture', // TODO! : fix year to be in searchOptions!
				bifa: 'bifa&year=2020&cat_id=best_british_independent_film',
				sitges: 'sitges&year=2020&cat_id=best_picture',
				stSebastian: 'ss&year=2020&cat_id=concha_oro',
				emmy: 'emmy&cat_id=drama_series&year=2020&cat_id=drama_series', // all series
				tiff: 'toronto&year=2020&cat_id=choice_award',
				venice: 'venice&year=2020&cat_id=golden_lion',
				oscars: 'academy_awards&year=2020&cat_id=best_picture',
				goya: 'goya&year=2020&cat_id=best_picture',
				goldenGlobe: 'goldenglobes&year=2020&cat_id=best_picture_drama',
				berlin: 'berlin&year=2021&cat_id=golden_bear',
			},
		},
		itemSelector: 'ul li',
		itemsSelector: {
			titleSelector: '.mc-title',
			directorSelector: '.mc-director',
			imageUrlSelector: '.mc-poster img@src',
			subItemLinkSelector: '.mc-title a@href',
			subItemsSelector: {
				genresSelector: ['.card-genres span'],
				castSelector: ['.card-cast span a@title'],
			},
		},
		pagination: '',
	},
	{
		name: 'filmAffinity',
		type: 'scraper',
		active: true,
		url: 'https://www.filmaffinity.com/',
		categorySelector: {
			netflix: 'en/cat_new_netflix.html',
			hbo: 'en/cat_new_hbo.html',
			serie: 'en/cat_current_tv.html',
			usa: 'en/cat_new_th_us.html',
			france: 'en/cat_estr_fr.html',
			uk: 'en/cat_new_th_uk.html',
		},
		itemSelector: '.movie-poster',
		itemsSelector: {
			titleSelector: 'a@title',
			imageUrlSelector: 'img@src',
			subItemLinkSelector: 'a@href',
			subItemsSelector: {
				directorSelector: '.directors',
				castSelector: ['.card-cast span a@title'],
				genresSelector: ['.card-genres span'],
			},
		},
		pagination: '',
	},
];
