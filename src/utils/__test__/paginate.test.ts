import { describe, expect, it } from "vitest";

import { clampPage, getTotalPages, paginate } from "@/utils";

const PAGE_SIZE = 5;

const makeItems = (count: number): number[] =>
  Array.from({ length: count }, (_, index) => index + 1);

describe("paginate", () => {
  it("returns the first 5 items of 12 on page 1 with 3 pages", () => {
    const result = paginate(makeItems(12), 1, PAGE_SIZE);

    expect(result.pagedItems).toEqual([1, 2, 3, 4, 5]);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(3);
  });

  it("returns the next 5 items on page 2", () => {
    const result = paginate(makeItems(12), 2, PAGE_SIZE);

    expect(result.pagedItems).toEqual([6, 7, 8, 9, 10]);
    expect(result.currentPage).toBe(2);
  });

  it("returns the remaining 2 items on the last page", () => {
    const result = paginate(makeItems(12), 3, PAGE_SIZE);

    expect(result.pagedItems).toEqual([11, 12]);
    expect(result.currentPage).toBe(3);
  });

  it("clamps page 0 and negative pages to page 1", () => {
    expect(paginate(makeItems(12), 0, PAGE_SIZE).currentPage).toBe(1);
    expect(paginate(makeItems(12), -4, PAGE_SIZE).currentPage).toBe(1);
  });

  it("clamps a page beyond the last page to the last page", () => {
    const result = paginate(makeItems(12), 99, PAGE_SIZE);

    expect(result.currentPage).toBe(3);
    expect(result.pagedItems).toHaveLength(2);
  });

  it("gives page 1 and 1 total page for an empty list", () => {
    const result = paginate([], 4, PAGE_SIZE);

    expect(result.pagedItems).toEqual([]);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it("uses the given page size", () => {
    expect(getTotalPages(10, 2)).toBe(5);
    expect(paginate(makeItems(10), 2, 2).pagedItems).toEqual([3, 4]);
  });
});

describe("clampPage", () => {
  it("keeps a valid page", () => {
    expect(clampPage(2, 12, PAGE_SIZE)).toBe(2);
  });

  it("moves back to the last valid page", () => {
    expect(clampPage(3, 10, PAGE_SIZE)).toBe(2);
  });
});
