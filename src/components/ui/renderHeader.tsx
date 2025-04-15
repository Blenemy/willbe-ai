import { ChevronDown, ChevronUp } from "lucide-react";

export const renderHeader = <T extends string>(
  label: string,
  key: T,
  sortKey: T,
  sortAsc: boolean,
  handleSort: (key: T) => void
) => (
  <th
    onClick={() => handleSort(key)}
    className="cursor-pointer select-none whitespace-nowrap"
  >
    <div className="flex items-center gap-1 min-w-[140px]">
      <div className="flex flex-col leading-none text-muted-foreground">
        {sortKey === key ? (
          sortAsc ? (
            <ChevronUp className="w-4 h-4 text-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-foreground" />
          )
        ) : (
          <div className="flex items-center">
            <ChevronUp className="w-4 h-4 p-0 -mr-1" />
            <ChevronDown className="w-4 h-4 p-0" />
          </div>
        )}
      </div>
      {label}
    </div>
  </th>
);
