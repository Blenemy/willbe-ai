export function toggleSelectAll(
  isAllSelected: boolean,
  currentPageIds: string[],
  setSelected: (val: (prev: string[]) => string[]) => void
) {
  if (isAllSelected) {
    deselectCurrentPage(currentPageIds, setSelected);
  } else {
    selectCurrentPage(currentPageIds, setSelected);
  }
}

export function selectCurrentPage(
  currentPageIds: string[],
  setSelected: (val: (prev: string[]) => string[]) => void
) {
  setSelected((prev) => [
    ...prev,
    ...currentPageIds.filter((id) => !prev.includes(id)),
  ]);
}

export function deselectCurrentPage(
  currentPageIds: string[],
  setSelected: (val: (prev: string[]) => string[]) => void
) {
  setSelected((prev) => prev.filter((id) => !currentPageIds.includes(id)));
}
