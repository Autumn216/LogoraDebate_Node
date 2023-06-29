import React from "react";
import { render, screen } from "@testing-library/react";
import { SideModalExample } from "./SideModal.composition";

describe("SideModal", () => {
  it("should appear with all the right default values", async () => {
    render(<SideModalExample />);
    expect(screen.getByText("Example Debate")).toBeInTheDocument();
  });

  it("should appear with 2 Buttons", async () => {
    render(<SideModalExample />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2);
  });
});
