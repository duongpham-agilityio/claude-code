import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ButtonSample } from "./index.sample";

afterEach(cleanup);

describe("ButtonSample", () => {
  it("renders its children as a button", () => {
    render(<ButtonSample>Save</ButtonSample>);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<ButtonSample onClick={onClick}>Save</ButtonSample>);

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <ButtonSample disabled onClick={onClick}>
        Save
      </ButtonSample>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards native attributes", () => {
    render(
      <ButtonSample type="submit" aria-label="Submit form">
        Go
      </ButtonSample>,
    );

    expect(screen.getByRole("button", { name: "Submit form" })).toHaveAttribute(
      "type",
      "submit",
    );
  });
});
