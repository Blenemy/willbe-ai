export function toggleSelectAll(
  isAllSelectedOnPage: boolean,
  currentPageIds: string[],
  setSelected: (val: (prev: string[]) => string[]) => void
) {
  setSelected((prev) => {
    if (isAllSelectedOnPage) {
      return prev.filter((id) => !currentPageIds.includes(id));
    } else {
      return [...prev, ...currentPageIds.filter((id) => !prev.includes(id))];
    }
  });
}
