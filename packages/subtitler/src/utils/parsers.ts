import { IGenericSubtitle, IOpenSubsItem, ISubdivxItem, ISubSceneSubtitle } from '@paranoids/types';
import Helpers from './helpers';
import * as settingsParsers from '../parsers-config.json';

export type ISubdivxItemType = ISubdivxItem;

export default class Parsers {
	static parseType(value: string): 'serie' | 'movie' | 'sport' {
		if (typeof value === 'string') {
			let regex: string[] | null;
			if (
				(regex = /(?:-\s*|[\s|.])(?:S?(?<season>\d{2}|[a-z]+?\s+Season))(?!\d+)([Ex](?<episode>\d{2}\b))?/gim.exec(
					value
				)) != null
			) {
				if ((regex = /^(WWE|wwe)|(ufc|UFC)/.exec(value)) != null) {
					return 'sport';
				}
				return 'serie';
			} else if ((regex = /^(WWE|wwe)|(ufc|UFC)/.exec(value)) != null) {
				return 'sport';
			} else if ((regex = /(tv serie|TV Serie|Tv Serie|TV Miniseries)/.exec(value)) !== null) {
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

			if (
				(regex = /(?:-\s*|[\s|.])(?:S?(?<season>\d{2}|[a-z]+?\s+Season))(?!\d+)([Ex](?<episode>\d{2}\b))?/gim.exec(
					value
				)) !== null
			) {
				obj.season = this.parseSeasonStr(regex.groups['season']);
				obj.episode = regex.groups['episode'] || null;
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
			const regexReleases = new RegExp(
				`(${releases.map((release: string) => `${release.toLowerCase()}|${release.toUpperCase()}`).join('|')})`,
				'gim'
			);
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
}
