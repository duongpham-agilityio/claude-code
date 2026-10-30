export interface PaginatedItems<T> {
  pagedItems: T[];
  currentPage: number;
  totalPages: number;
}

export const getTotalPages = (itemCount: number, pageSize: number): number =>
  Math.max(1, Math.ceil(itemCount / pageSize));

export const clampPage = (
  page: number,
  itemCount: number,
  pageSize: number,
): number =>
  Math.min(Math.max(1, Math.trunc(page) || 1), getTotalPages(itemCount, pageSize));

export const paginate = <T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginatedItems<T> => {
  const totalPages = getTotalPages(items.length, pageSize);
  const currentPage = clampPage(page, items.length, pageSize);
  const start = (currentPage - 1) * pageSize;

  return {
    pagedItems: items.slice(start, start + pageSize),
    currentPage,
    totalPages,
  };
};
