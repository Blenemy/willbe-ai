import { Skeleton } from "@/components/ui/skeleton";

const ProductsAndServicesSkeleton = () => {
  return (
    <div className="px-6 flex flex-col gap-5">
      <h2 className="font-bold text-xl">Products & Services</h2>
      <Skeleton className="w-full h-28 bg-gray-200" />
      <Skeleton className="w-full h-28 bg-gray-200" />
      <Skeleton className="w-full h-28 bg-gray-200" />
    </div>
  );
};

export default ProductsAndServicesSkeleton;
