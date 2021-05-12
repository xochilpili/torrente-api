import { baseHeaders } from '@paranoids/torrente-utils';
import fetch from 'node-fetch';
import * as queryString from 'querystring';

export class TmdbService {
	async searchByActor(name: string): Promise<any[]> {
		const response = await fetch(
			`${process.env.TMDB_API_URL}/person?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${queryString.escape(name)}&page=1&incude_adult=false`,
			baseHeaders
		);
		const actorData = await response.json();
		if (actorData) {
			const movieRequest = await fetch(
				`${process.env.TMDB_API_URL}/person/${actorData.results[0].id}/movie_credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
				baseHeaders
			);
			return await movieRequest.json();
		}
	}
}
