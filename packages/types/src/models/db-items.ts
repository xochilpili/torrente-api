export interface IMovieRow {
	id_movie?: number;
	title: string;
	year: number;
}

export interface IKriteria {
	field: string;
	operator: '=' | '<>' | '>' | '<' | 'like';
	value: string;
}
