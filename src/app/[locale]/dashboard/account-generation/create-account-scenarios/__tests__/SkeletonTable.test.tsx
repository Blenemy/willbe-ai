import { render, screen } from "@testing-library/react";
import { SkeletonTable } from "../skeletons/SkeletonTable";

describe("SkeletonTable", () => {
  it("renders 12 skeleton rows", () => {
    render(<SkeletonTable />);

    const rows = screen.getAllByTestId("skeleton-row");
    expect(rows).toHaveLength(12);
  });

  it("renders header skeletons when showHeader is true", () => {
    render(<SkeletonTable showHeader />);

    expect(screen.getByTestId("skeleton-header-title")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-header-button")).toBeInTheDocument();

    expect(screen.getByTestId("skeleton-input")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-spinner")).toBeInTheDocument();
  });

  it("does not render header when showHeader is false", () => {
    render(<SkeletonTable showHeader={false} />);

    expect(
      screen.queryByTestId("skeleton-header-title")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("skeleton-header-button")
    ).not.toBeInTheDocument();
  });
});
