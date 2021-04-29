import Parsers from '../../../src/utils/parsers';
import { ISubdivxItem, IGenericSubtitle } from '@paranoids/types';

describe('Parser Util Test', () => {
	it('should parse correctly type', () => {
		const testTiles: string[] = [
			'fake-movie.2021.HDTV.yify.mp4',
			'Justice Society: World War II (2021) 720p WEB-DL 575MB nItRo',
			'Blithe Spirit (2020) BRRip 575MB nItRo',
			'WWE Monday Night RAW 2020.04.26 HDTV 575MB nItRo',
			'Supergirl S06E05 720p HDTV 300MB nItRo',
			'Black Lightning S04E09 720p HDTV 300MB nItRo',
		];
		const result: string[] = testTiles.map((title) => Parsers.parseType(title));
		expect(result).toStrictEqual(['movie', 'movie', 'movie', 'sport', 'serie', 'serie']);
	});

	it('should parse correctly tvShow season | episode', () => {
		const titles: string[] = [
			'Supergirl S06E05 720p HDTV 300MB nItRo',
			'Black Lightning S04E09 720p HDTV 300MB nItRo',
			'The Good Doctor S04E15 720p HDTV 300MB nItRo',
			'FBI Most Wanted S02E11 720p HDTV 300MB nItRo',
			'vikings fifth season',
			'Female sixth season',
			'House twelve season',
		];
		const result: { season: number; episode: number }[] = titles.map((title) => Parsers.parseSerie(title));
		expect(result).toStrictEqual([
			{ episode: '05', season: 6 },
			{ episode: '09', season: 4 },
			{ episode: '15', season: 4 },
			{ episode: '11', season: 2 },
			{ episode: null, season: 5 },
			{ episode: null, season: 6 },
			{ episode: null, season: 12 },
		]);
	});

	it('should replace CR from string', () => {
		const titles: string[] = [
			'\r\n\t\t\t\t\t\tLove Weddings and Other Disasters 2020 1080p WEB-DL DD5 1 H 264-HI \r\n\t\t\t\t\t',
			'\r\n\t\t\t\t\t\tEnglish\r\n\t\t\t\t\t',
			'\r\n\t\t\t\t\t\tLove Weddings and Other Disasters 2020 HDRip XviD \r\n\t\t\t\t\t',
			'\r\n\t\t\t\t\t\tEP4.2005.DualAudio.DVDRip.XviD-NewMov.ENG \r\n\t\t\t\t\t',
		];
		const result: string[] = titles.map((title) => Parsers.sanitizeString(title));
		expect(result).toStrictEqual([
			'Love Weddings and Other Disasters 2020 1080p WEB-DL DD5 1 H 264-HI',
			'English',
			'Love Weddings and Other Disasters 2020 HDRip XviD',
			'EP4.2005.DualAudio.DVDRip.XviD-NewMov.ENG',
		]);
	});

	it('should parse correctly release group', () => {
		const titles: string[] = [
			'bbc blood of the vikings 1of5 first blood dvb divx521 mp3\r\nsubs-team',
			'tomados de subtitulos es y retocadas palabras al latino para "vikings s01e01 720p  x264-2hd" y "vikings s01e01 repack  x264-2hd"',
			'de argenteam para vikings s01e01 rites of passage repack  x264-2hd  traducido por: lolipop2 x2, coloradense, josesteves & hori',
			'de subtitulos es - vikings s01e01 repack  x264-2hd',
			'extraidos de vikings s01 complete -fullsize por olakehace-cinemaniahd, rippeados y corregidos por mi para el capitulo 1, incluye forzados ',
			'subtitulos para: vikings s01e01   afg - vikings s01e01  x264 2hd - vikings s01e01 720p  x264 2hd - ttraducido y corregido por: akallabeth  :: thesubfactory :: ',
			'de argenteam para vikings s01e01  -afg  traducido por: lolipop2 x2, coloradense, josesteves & hori',
			'de argenteam para vikings s01e01 rites of passage 720p  x264-2hd  traducido por: lolipop2 x2, coloradense, josesteves & hori',
			'original de subtitulos es, editado al español latino, re-sincronice, y le di mayor tiempo de lectura para la versión, "repack-x264-2hd", comentar si funciona con otras versiones ',
			'subtitulos es para vikings s01e01 720p  x264-2hd',
			'son de subtitulos es, la traducción es muy buena en español peninsular, sólo hice unos ajustes, incluí dos referencias y corregí la duración de lineas ',
			'para vikings s01 e01 rites of passage 2013  1080p dts-hd ma 5 1 avc remux-framestor de 10,9gb',
			'extraido del -r por mstheeduard ripeado y corregidos errores de ocr y demas cosas por mi, seguro va bien con los : rites of passage',
			'vikings s01e01 perfectamente sincronizados para la versión de 720p  enjoy!!',
			'para la versión vikings s01e01  -afg  corregidos por mí al español neutro  que los disfruten ',
			'traducción por subtitulos es, sincronizado (tiempos de addic7ed) y corregido para  (versión extendida)  español de latinoamérica ',
			'de argenteam para vikings s01e01 rites of passage 1080p web-dl dd5 1 h 264-ctrlhd  traducido por: lolipop2 x2, coloradense, josesteves & hori',
		];
		const result: string[][] = titles.map((title) => Parsers.parseReleases(title)).filter((s) => s);
		expect(result).toStrictEqual([
			['2hd', '2hd'],
			['2hd', 'lol'],
			['2hd'],
			['afg', '2hd', '2hd'],
			['afg', 'lol'],
			['2hd', 'lol'],
			['2hd'],
			['2hd'],
			['joy'],
			['afg'],
			['ctrlhd', 'lol'],
		]);
	});

	it('should parse correctly quality', () => {
		const titles: string[] = [
			'bbc blood of the vikings 1of5 first blood dvb divx521 mp3\r\nsubs-team',
			'tomados de subtitulos es y retocadas palabras al latino para "vikings s01e01 720p  x264-2hd" y "vikings s01e01 repack  x264-2hd"',
			'de argenteam para vikings s01e01 rites of passage repack  x264-2hd  traducido por: lolipop2 x2, coloradense, josesteves & hori',
			'de subtitulos es - vikings s01e01 repack  x264-2hd',
			'extraidos de vikings s01 complete -fullsize por olakehace-cinemaniahd, rippeados y corregidos por mi para el capitulo 1, incluye forzados ',
			'subtitulos para: vikings s01e01   afg - vikings s01e01  x264 2hd - vikings s01e01 720p  x264 2hd - ttraducido y corregido por: akallabeth  :: thesubfactory :: ',
			'de argenteam para vikings s01e01  -afg  traducido por: lolipop2 x2, coloradense, josesteves & hori',
			'de argenteam para vikings s01e01 rites of passage 720p  x264-2hd  traducido por: lolipop2 x2, coloradense, josesteves & hori',
			'original de subtitulos es, editado al español latino, re-sincronice, y le di mayor tiempo de lectura para la versión, "repack-x264-2hd", comentar si funciona con otras versiones ',
			'subtitulos es para vikings s01e01 720p  x264-2hd',
			'son de subtitulos es, la traducción es muy buena en español peninsular, sólo hice unos ajustes, incluí dos referencias y corregí la duración de lineas ',
			'para vikings s01 e01 rites of passage 2013  1080p dts-hd ma 5 1 avc remux-framestor de 10,9gb',
			'extraido del -r por mstheeduard ripeado y corregidos errores de ocr y demas cosas por mi, seguro va bien con los : rites of passage',
			'vikings s01e01 perfectamente sincronizados para la versión de 720p  enjoy!!',
			'para la versión vikings s01e01  -afg  corregidos por mí al español neutro  que los disfruten ',
			'traducción por subtitulos es, sincronizado (tiempos de addic7ed) y corregido para  (versión extendida)  español de latinoamérica ',
			'de argenteam para vikings s01e01 rites of passage 1080p web-dl dd5 1 h 264-ctrlhd  traducido por: lolipop2 x2, coloradense, josesteves & hori',
			'Black Lightning S04E09 720p HDTV 300MB nItRo',
			'The Good Doctor S04E15 720p HDTV 300MB nItRo',
			'FBI Most Wanted S02E11 720p HDTV 300MB nItRo',
		];
		const result: string[][] = titles.map((title) => Parsers.parseQuality(title)).filter((s) => s);
		expect(result).toStrictEqual([
			['720p'],
			['720p'],
			['720p'],
			['720p'],
			['1080p'],
			['720p'],
			['1080p', 'web-dl'],
			['720p', 'HDTV'],
			['720p', 'HDTV'],
			['720p', 'HDTV'],
		]);
	});

	it('should parse correctly year', () => {
		const titles: string[] = [
			'fake-movie.2021.HDTV.yify.mp4',
			'Justice Society: World War II (2021) 720p WEB-DL 575MB nItRo',
			'Blithe Spirit (2020) BRRip 575MB nItRo',
			'WWE Monday Night RAW 2020.04.26 HDTV 575MB nItRo',
			'Supergirl S06E05 720p HDTV 300MB nItRo',
			'Black Lightning S04E09 720p HDTV 300MB nItRo',
		];
		const results: string[][] = titles.map((title) => Parsers.parseYear(title)).filter((s) => s);
		expect(results).toStrictEqual([['2021'], ['2021'], ['2020'], ['2020']]);
	});

	it('should parse subtitle correctly', () => {
		const subdivxSubtitleResult: ISubdivxItem = {
			provider: 'subdivx',
			title: 'Subtitulos de Blood of the Vikings S01E01',
			link: 'https://www.subdivx.com/bajar.php?id=237802&u=7',
			desc: 'bbc blood of the vikings 1of5 first blood dvb divx521 mp3 subs-team',
		};
		const subdivxExpected: IGenericSubtitle = {
			desc: 'bbc blood of the vikings 1of5 first blood dvb divx521 mp3 subs-team',
			episode: 1,
			link: 'https://www.subdivx.com/bajar.php?id=237802&u=7',
			provider: 'subdivx',
			quality: [],
			releases: [],
			season: 1,
			title: 'Blood of the Vikings S01E01',
			type: 'serie',
			year: null,
		} as IGenericSubtitle;
		// TODO: add more examples | subscene | opensubtitles
		const result = Parsers.parseSubtitle(subdivxSubtitleResult);
		expect(result).toStrictEqual(subdivxExpected);
	});
});
