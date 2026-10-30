import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { usePagination } from "@/hooks/shared";

const makeItems = (count: number): number[] =>
  Array.from({ length: count }, (_, index) => index + 1);

describe("usePagination", () => {
  it("starts on page 1 with the first page slice", () => {
    const { result } = renderHook(() => usePagination(makeItems(12), 5));

    expect(result.current.pagedItems).toEqual([1, 2, 3, 4, 5]);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(3);
  });

  it("setPage moves to another page slice", () => {
    const { result } = renderHook(() => usePagination(makeItems(12), 5));

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.pagedItems).toEqual([11, 12]);
  });

  it("setPage clamps to the valid page range", () => {
    const { result } = renderHook(() => usePagination(makeItems(12), 5));

    act(() => {
      result.current.setPage(99);
    });
    expect(result.current.currentPage).toBe(3);

    act(() => {
      result.current.setPage(0);
    });
    expect(result.current.currentPage).toBe(1);
  });

  it("moves back to the last valid page when the last page empties", () => {
    let items = makeItems(11);
    const { result, rerender } = renderHook(() => usePagination(items, 5));
    act(() => {
      result.current.setPage(3);
    });

    items = makeItems(10);
    rerender();

    expect(result.current.currentPage).toBe(2);
    expect(result.current.pagedItems).toEqual([6, 7, 8, 9, 10]);
  });

  it("resetPage goes back to page 1", () => {
    const { result } = renderHook(() => usePagination(makeItems(12), 5));
    act(() => {
      result.current.setPage(3);
    });

    act(() => {
      result.current.resetPage();
    });

    expect(result.current.currentPage).toBe(1);
  });
});
