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
