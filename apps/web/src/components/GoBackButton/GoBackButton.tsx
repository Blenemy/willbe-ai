import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const GoBackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center text-[#030A27] hover:underline text-sm font-medium"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to connections
    </button>
  );
};
