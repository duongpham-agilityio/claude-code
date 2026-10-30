import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Pagination } from "./index";

afterEach(cleanup);

describe("Pagination", () => {
  it("renders nothing when there is a single page", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a labelled nav with Prev, Next and every page number", () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />,
    );

    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Prev" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 3" })).toBeInTheDocument();
  });

  it("disables Prev on the first page", () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />,
    );

    expect(screen.getByRole("button", { name: "Prev" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  it("disables Next on the last page", () => {
    render(
      <Pagination currentPage={3} totalPages={3} onPageChange={vi.fn()} />,
    );

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Prev" })).toBeEnabled();
  });

  it("marks only the current page with aria-current", () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />,
    );

    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Page 1" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByRole("button", { name: "Page 3" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("calls onPageChange with the clicked page number", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Page 3" }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with the previous and next page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Prev" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });
});
