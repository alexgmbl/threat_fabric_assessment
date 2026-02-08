export interface OpenLibrarySearchDoc {
  key: string;
  name?: string;
  author_name?: string[];
  title?: string;
  first_publish_year?: number;
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  numFoundExact?: boolean;
  docs: OpenLibrarySearchDoc[];
}

export interface OpenLibraryAuthorResponse {
  key: string;
  name: string;
  personal_name?: string;
  birth_date?: string;
  death_date?: string;
  bio?: string | { type: string; value: string };
  alternate_names?: string[];
}
