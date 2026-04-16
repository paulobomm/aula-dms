export interface HateoasLink {
  rel: string;
  href: string;
  method: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
