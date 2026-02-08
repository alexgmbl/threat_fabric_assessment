export interface OpenLibrarySearchDoc {
  key: string;
  title?: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  numFoundExact?: boolean;
  docs: OpenLibrarySearchDoc[];
}

export interface OpenLibraryAuthorLink {
  title?: string;
  url: string;
  type?: {
    key: string;
  };
}

export interface OpenLibraryAuthorResponse {
  key: string;
  name: string;
  personal_name?: string;
  birth_date?: string;
  death_date?: string;
  bio?: string | { type: string; value: string };
  alternate_names?: string[];
  links?: OpenLibraryAuthorLink[];
}
