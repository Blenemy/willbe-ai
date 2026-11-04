/* eslint-disable @typescript-eslint/no-explicit-any */
export const BarChart = ({ children }: any) => (
  <div data-testid="BarChart">{children}</div>
);
export const Bar = ({ children }: any) => (
  <div data-testid="Bar">{children}</div>
);
export const XAxis = () => <div data-testid="XAxis" />;
export const YAxis = () => <div data-testid="YAxis" />;
export const Tooltip = () => <div data-testid="Tooltip" />;
export const ResponsiveContainer = ({ children }: any) => <div>{children}</div>;
export const Cell = () => <div className="mock-bar" />;
export const CartesianGrid = () => <div data-testid="CartesianGrid" />;
