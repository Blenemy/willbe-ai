export const createMockTab = (name: string) => {
  const Mock = () => <div />;
  Mock.displayName = `Mock${name}`;
  return Mock;
};
