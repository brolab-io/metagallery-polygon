export type PaginationResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: number;
  hasNextPage: number;
  prevPage: null | number;
  nextPage: null | number;
};
