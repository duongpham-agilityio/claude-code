import { useState } from "react";

// Utils
import { paginate } from "@/utils";

export const usePagination = <T>(items: T[], pageSize: number) => {
  const [page, setPage] = useState(1);

  // Derived from `page`, so the view never points past the last page
  // (for example after the last item of the last page is removed).
  const { pagedItems, currentPage, totalPages } = paginate(
    items,
    page,
    pageSize,
  );

  const goToPage = (nextPage: number): void => {
    setPage(paginate(items, nextPage, pageSize).currentPage);
  };

  const resetPage = (): void => {
    setPage(1);
  };

  return { pagedItems, currentPage, totalPages, setPage: goToPage, resetPage };
};
