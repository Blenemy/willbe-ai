import { Skeleton } from "@/components/ui/skeleton";

const CompanyTabSkeleton = () => {
  return (
    <div className="px-6 flex flex-col gap-5">
      <h2 className="font-bold text-xl">Your Company</h2>
      <Skeleton className="w-full h-28 bg-gray-200" />
      <Skeleton className="w-full h-28 bg-gray-200" />
      <Skeleton className="w-full h-28 bg-gray-200" />
    </div>
  );
};

export default CompanyTabSkeleton;
