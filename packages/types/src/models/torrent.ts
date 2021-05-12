export enum Provider {
	leetx = '1337x',
	tpb = 'ThePirateBay',
	limeTorrents = 'LimeTorrents',
	eztv = 'Eztv',
	kickAss = 'KickassTorrents',
	rarbg = 'Rarbg',
	tor9 = 'Torrent9',
	torrentProject = 'TorrentProject',
	torrentz = 'Torrentz2',
	yify = 'Yts',
}

export interface ITorrentSearchOptions {
	provider: Provider[];
	query: string;
	category: 'All' | 'Video' | 'Top100' | 'Movies' | 'TV';
	torrentLimit?: number;
	releases?: string[];
	quality?: string[];
}

export interface ITorrentItem {
	provider: string;
	id: string;
	title: string;
	time: Date;
	seeds: number;
	peers: number;
	size: string;
	magnet: string;
	numFiles: number;
	status: string;
	category: string;
	imdb: string;
}

export interface IGenericTorrent extends ITorrentItem {
	releases?: string[];
	quality?: string[];
}
