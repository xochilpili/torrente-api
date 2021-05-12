import {
	IGenericItem,
	IGenericSubtitle,
	IOpenSubsItem,
	ISubdivxItem,
	ISubSceneSubtitle,
	IMediaItem,
	ITorrentItem,
	IGenericTorrent,
} from '@paranoids/torrente-types';
import { Helpers } from './helpers';
import * as settingsParsers from '../parsers-config.json';

export type ISubdivxItemType = ISubdivxItem;

export class Parsers {
	static parseTitle(value: string): string {
		if (typeof value === 'string') {
			let regex: string[] | null;
			if ((regex = /^(?:(?!\([^)]*\)|(s|S)\d+(e|E)\d+|season).)*/gim.exec(value)) !== null) {
				const alsoKnowTitle = regex[0].split('/');
				return alsoKnowTitle.length > 1
					? alsoKnowTitle[1].trim().length < 3
						? regex[0].replace(/\.|-/, '').trim()
						: alsoKnowTitle[1].replace(/\.|-/, '').trim()
					: regex[0].replace(/\.|-/, '').trim();
			}
		}
	}

	static parseType(value: string): 'serie' | 'movie' | 'sport' {
		if (typeof value === 'string') {
			let regex: string[] | null;
			if ((regex = /(?:-\s*|[\s|.])(?:S?(?<season>\d{2}|[a-z]+?\s+Season))(?!\d+)([Ex](?<episode>\d{2}\b))?/gim.exec(value)) != null) {
				if ((regex = /^(WWE|wwe)|(ufc|UFC)/.exec(value)) != null) {
					return 'sport';
				}
				return 'serie';
			} else if ((regex = /^(.*?)(s?([0-9]+)[ex]([0-9]+)|part|season\s?\d+).*$/gim.exec(value)) !== null) {
				return 'serie';
			} else if ((regex = /^(WWE|wwe)|(ufc|UFC)/.exec(value)) != null) {
				return 'sport';
			} else if ((regex = /(tv serie|TV Serie|Tv Serie|TV Miniseries)/gim.exec(value)) !== null) {
				return 'serie';
			} else if ((regex = /^(.*?\d{4})/.exec(value)) != null) {
				return 'movie';
			} else {
				return 'movie';
			}
		}
	}

	static parseSerie(value: string): { season: number; episode: number } {
		if (typeof value === 'string') {
			let regex;
			const obj: { season: number; episode: number } = { season: 0, episode: 0 };

			if ((regex = /(?:-\s*|[\s|.])(?:S?(?<season>\d{2}|[a-z]+?\s+Season))(?!\d+)([Ex](?<episode>\d{2}\b))?/gim.exec(value)) !== null) {
				obj.season = this.parseSeasonStr(regex.groups['season']);
				obj.episode = regex.groups['episode'] || null;
			} else if ((regex = /^(.*?)(s?([0-9]+)[ex]([0-9]+)|part|season).(?<season>\d)*/gim.exec(value)) !== null) {
				obj.season = regex.groups['season'] ? regex.groups['season'] : regex[3];
				obj.episode = regex[4] ? regex[4] : null;
			}
			return obj;
		}
	}

	static parseSeasonStr(value: string): number {
		if (typeof value === 'string') {
			let regex;
			if ((regex = /first|one|primera/gi.exec(value)) !== null) {
				return 1;
			} else if ((regex = /econd|two|dos|egunda/gim.exec(value)) !== null) {
				return 2;
			} else if ((regex = /third|three|tres|tercera/gim.exec(value)) !== null) {
				return 3;
			} else if ((regex = /fourth|four|cuatro|cuarta/gim.exec(value)) !== null) {
				return 4;
			} else if ((regex = /fifth|five|cinco|quinta/gim.exec(value)) !== null) {
				return 5;
			} else if ((regex = /ixth|ix|eis|exta/gim.exec(value)) !== null) {
				return 6;
			} else if ((regex = /eventh|even|iete|eptima/gim.exec(value)) !== null) {
				return 7;
			} else if ((regex = /eighth|eight|ocho|octava/gim.exec(value)) !== null) {
				return 8;
			} else if ((regex = /ninth|nine|nueve|novena/gim.exec(value)) !== null) {
				return 9;
			} else if ((regex = /tenth|ten|decima|diez/gim.exec(value)) !== null) {
				return 10;
			} else if ((regex = /eleventh|eleven|onceava|once/gim.exec(value)) !== null) {
				return 11;
			} else if ((regex = /twelfth|twelve|doce|doceava/gim.exec(value)) !== null) {
				return 12;
			} else if ((regex = /thirtheenth|Thirteen|trece|treceava/gim.exec(value)) !== null) {
				return 13;
			} else if ((regex = /fourteenth|fourteen|catorce|catorceava/gim.exec(value)) !== null) {
				return 14;
			} else if ((regex = /fifteenth|fifteen|quince|quinceava/gim.exec(value)) !== null) {
				return 15;
			} else if ((regex = /ixteenth|ixteen|dieciseis|dieziceis|dieziceis|decimosexta/gim.exec(value)) !== null) {
				return 16;
			} else {
				return +value;
			}
		}
	}

	static sanitizeString(value: string): string {
		if (typeof value === 'string') {
			const str = value.replace(/\n|\r|\t/g, '');
			return str.trim();
		}
	}

	static parseReleases(value: string): string[] {
		if (typeof value === 'string') {
			const releases = settingsParsers.releases.split('|');
			const regexReleases = new RegExp(`(${releases.map((release: string) => `${release.toLowerCase()}|${release.toUpperCase()}`).join('|')})`, 'gim');
			return value.match(regexReleases);
		}
	}

	static parseQuality(value: string): string[] {
		if (typeof value === 'string') {
			const { qualities } = settingsParsers;
			const regexQualities = new RegExp(qualities, 'gim');
			return value.match(regexQualities);
		}
	}

	static parseYear(value: string): string[] {
		if (typeof value === 'string') {
			return value.match(/\b[\d]{4}\b/gm);
		}
	}

	static parseIMDBID(value: string): string {
		if (typeof value === 'string') {
			let regex: string[];
			if ((regex = /(tt[0-9]{7,8})/gim.exec(value)) !== null) {
				return regex[0];
			}
		}
	}

	static parseText(value: string, type: string): string[] {
		if (typeof value === 'string') {
			const str = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			const regCast = new RegExp(`${type}(.*)`, 'gim');
			const result = str.match(regCast);
			if (result && result.length > 0) {
				const gen = result[0].split(/genero:\s|:\[|:\s\[/gi);
				if (gen[1]) {
					const genres = gen[1].split(/\||,/);
					return genres.map((genre) => genre.replace('.', '').toLowerCase().trim());
				} else {
					return result[0]
						.replace(/(cast|reparto|director|stars|genre|genero):/gim, '')
						.split(/,|\|/)
						.map((item: string) => item.toLowerCase().trim());
				}
			}
			return null;
		}
	}

	static parseSubtitle(item: ISubdivxItem | ISubSceneSubtitle | IOpenSubsItem): IGenericSubtitle {
		let matchReleases: string[];
		let matchQuality: string[];
		let matchYear: string[];
		switch (item.provider) {
		case 'subdivx':
			matchReleases = Parsers.parseReleases(item.desc);
			matchQuality = Parsers.parseQuality(item.desc);
			matchYear = Parsers.parseYear(item.title);
			item.type = Parsers.parseType(item.title);
			item.title = item.title.replace(/subtitulos\sde/gim, '');
			item.releases = matchReleases ? Helpers.uniqArray(matchReleases) : [];
			item.quality = matchQuality ? Helpers.uniqArray(matchQuality) : [];
			item.year = matchYear ? Helpers.uniqArray(matchYear).join('') : null;
			break;
		case 'subscene':
			item.filename = Parsers.sanitizeString(item.filename);
			matchReleases = Parsers.parseReleases(item.filename);
			matchQuality = Parsers.parseQuality(item.filename);
			matchYear = Parsers.parseYear(item.filename);

			item.type = Parsers.parseType(item.filename);
			item.lang = Parsers.sanitizeString(item.lang);
			item.releases = matchReleases ? Helpers.uniqArray(matchReleases) : [];
			item.quality = matchQuality ? Helpers.uniqArray(matchQuality) : [];
			item.year = matchYear ? Helpers.uniqArray(matchYear).join('') : null;
			break;
		case 'opensubtitles':
			matchReleases = Parsers.parseReleases(item.filename);
			matchQuality = Parsers.parseQuality(item.filename);
			matchYear = Parsers.parseYear(item.filename);

			item.type = Parsers.parseType(item.filename);
			item.releases = matchReleases ? Helpers.uniqArray(matchReleases) : [];
			item.quality = matchQuality ? Helpers.uniqArray(matchQuality) : [];
			item.year = matchYear ? Helpers.uniqArray(matchYear).join('') : null;
			break;
		}

		item.title = Parsers.sanitizeString(item.title);
		if (item.type === 'serie') {
			const { season, episode } = Parsers.parseSerie(item.title);
			item.season = season;
			item.episode = episode !== null ? +episode : episode;
		}

		return {
			...item,
		} as IGenericSubtitle;
	}

	static parseMediaItem(item: IGenericItem): IMediaItem {
		let matchYear;
		let matchGenres;
		let matchCast;
		let matchDirector;
		switch (item.provider) {
		default:
			matchGenres = Parsers.parseText(item.rawText, '(genero|genre)');
			matchYear = Parsers.parseYear(item.title);
			matchYear = matchYear
				? Helpers.uniqArray(matchYear).join('')
				: Parsers.parseYear(item.rawText)
					? Parsers.parseYear(item.rawText).join('')
					: null;
			matchCast = Parsers.parseText(item.rawText, '(cast|reparto|stars)');
			matchDirector = Parsers.parseText(item.rawText, 'director');
			item.type = Parsers.parseType(item.title);
			item.genres =
					item.provider === 'festivals' || item.provider === 'filmAffinity'
						? item.genres.map((g) => g.toLowerCase().trim())
						: matchGenres
							? Helpers.uniqArray(matchGenres)
							: null;
			item.year = matchYear;
			item.imdbId = Parsers.parseIMDBID(item.rawText);
			item.cast =
					item.provider === 'festivals' || item.provider === 'filmAffinity'
						? Helpers.uniqArray(item.cast.map((c) => c.toLowerCase().trim()))
						: matchCast
							? Helpers.uniqArray(matchCast)
							: null;
			item.director = matchDirector ? matchDirector : Parsers.sanitizeString(item.director);
		}
		if (item.type === 'serie') {
			const { season, episode } = Parsers.parseSerie(item.title);
			item.season = season;
			item.episode = episode !== null ? +episode : episode;
		}
		item.title = Parsers.parseTitle(item.title);
		// eslint-disable-next-line no-console
		// console.log('fucking title', item.title, Parsers.parseTitle(item.title));
		// console.log(JSON.stringify(item, null, 4));
		return {
			provider: item.provider,
			type: item.type,
			title: item.title,
			originalTitle: item.originalTitle,
			...(item.imdbId && { imdbId: item.imdbId }),
			portrait: item.imageUrl,
			...(item.country && { country: item.country }),
			year: +item.year,
			...(item.director && { director: item.director }),
			...(item.cast && { cast: item.cast }),
			genres: item.genres,
			...(item.torrent && { torrents: item.torrent }),
			...(item.subtitles && { subtitles: item.subtitles }),
			...(item.season && { season: item.season }),
			...(item.episode && { episode: item.episode }),
		};
	}

	static parseTorrent(item: ITorrentItem): IGenericTorrent {
		const matchReleases = Parsers.parseReleases(item.title);
		const matchQuality = Parsers.parseQuality(item.title);
		return {
			...item,
			releases: matchReleases ? Helpers.uniqArray(matchReleases) : null,
			quality: matchQuality ? Helpers.uniqArray(matchQuality) : null,
		};
	}
}
