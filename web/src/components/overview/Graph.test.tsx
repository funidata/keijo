import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Graph from "./Graph";
import OverviewContextProvider from "./OverviewContext";
import { TimelineGraphVariant, TotalsGraphVariant } from "./graphTypes";

const mocks = vi.hoisted(() => ({
  updateOverviewConfig: vi.fn(),
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: () => ({ data: undefined }),
  useMutation: () => [mocks.updateOverviewConfig],
}));

vi.mock("./TimelineGraph", () => ({
  default: ({ onChangeVariant }: { onChangeVariant: (variant: TimelineGraphVariant) => void }) => (
    <button
      data-testid="timeline-graph"
      onClick={() => onChangeVariant(TimelineGraphVariant.Unstacked)}
    >
      test
    </button>
  ),
}));

vi.mock("./TotalsGraph", () => ({
  default: ({ onChangeVariant }: { onChangeVariant: (variant: TotalsGraphVariant) => void }) => (
    <button data-testid="totals-graph" onClick={() => onChangeVariant(TotalsGraphVariant.Pie)}>
      test
    </button>
  ),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  mocks.updateOverviewConfig.mockReset();
});

function renderGraph(config: Parameters<typeof Graph>[0]["config"]) {
  return render(
    <OverviewContextProvider workdays={[]}>
      <Graph config={config} graphIndex={1} groupBy="product" zoneIndex={0} />
    </OverviewContextProvider>,
  );
}

describe("Graph", () => {
  it("renders TimelineGraph for a timeline configuration", () => {
    renderGraph({ type: "timeline", variant: TimelineGraphVariant.Stacked });

    expect(screen.getByTestId("timeline-graph")).toBeTruthy();
    expect(screen.queryByTestId("totals-graph")).toBeNull();
  });

  it("renders TotalsGraph for a totals configuration", () => {
    renderGraph({ type: "totals", variant: TotalsGraphVariant.BarVertical });

    expect(screen.getByTestId("totals-graph")).toBeTruthy();
    expect(screen.queryByTestId("timeline-graph")).toBeNull();
  });

  it("forwards a graph variant change with the graph and zone indices", () => {
    renderGraph({ type: "timeline", variant: TimelineGraphVariant.Stacked });

    fireEvent.click(screen.getByTestId("timeline-graph"));

    const updateCall = mocks.updateOverviewConfig.mock.calls[0][0];
    expect(updateCall.variables.config[0].graphs[1]).toEqual({
      type: "timeline",
      variant: TimelineGraphVariant.Unstacked,
    });
  });
});
