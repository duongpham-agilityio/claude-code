export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BUTTON_CLASS =
  "min-w-9 rounded px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-40";

const CURRENT_BUTTON_CLASS =
  "min-w-9 rounded bg-gray-900 px-3 py-1 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-gray-900";

export const Pagination = (props: PaginationProps) => {
  if (props.totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: props.totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        className={BUTTON_CLASS}
        disabled={props.currentPage <= 1}
        onClick={() => props.onPageChange(props.currentPage - 1)}
      >
        Prev
      </button>
      {pages.map((page) => {
        const isCurrent = page === props.currentPage;

        return (
          <button
            key={page}
            type="button"
            className={isCurrent ? CURRENT_BUTTON_CLASS : BUTTON_CLASS}
            aria-current={isCurrent ? "page" : undefined}
            onClick={() => props.onPageChange(page)}
          >
            {page}
          </button>
        );
      })}
      <button
        type="button"
        className={BUTTON_CLASS}
        disabled={props.currentPage >= props.totalPages}
        onClick={() => props.onPageChange(props.currentPage + 1)}
      >
        Next
      </button>
    </nav>
  );
};
