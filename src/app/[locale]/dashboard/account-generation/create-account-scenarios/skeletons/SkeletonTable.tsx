import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

interface Props {
  showHeader?: boolean;
}

export const SkeletonTable = ({ showHeader }: Props) => {
  const skeletonIds = useMemo(
    () => Array.from({ length: 12 }, (_, i) => `row-${i}`),
    []
  );

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-4 animate-pulse">
      {showHeader && (
        <>
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="flex items-center gap-4 max-w-md">
            <Skeleton className="h-10 w-full flex-1" />
            <Skeleton className="h-10 w-5" />
          </div>
        </>
      )}

      <div className="space-y-2 mt-4">
        {skeletonIds.map((id) => (
          <Skeleton key={id} className="h-10 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
};
