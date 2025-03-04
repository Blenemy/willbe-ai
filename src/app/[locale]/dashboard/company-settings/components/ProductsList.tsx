import { ProductsAndServices } from "@/types/Company";
import ProfileCard from "../../profile/tabs/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { memo } from "react";

interface ProductsListProps {
  productsList: ProductsAndServices[] | undefined;
  handleEdit: (product: ProductsAndServices) => void;
  handleDelete: (product: ProductsAndServices) => void;
}

const ProductsList = ({
  productsList,
  handleDelete,
  handleEdit,
}: ProductsListProps) => {
  if (!productsList) {
    return null;
  }

  return (
    <>
      {productsList.map((product) => (
        <ProfileCard key={product.id} title={product.name}>
          <p className="text-gray-500 truncate">{product.description}</p>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(product)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(product)}
            >
              Delete
            </Button>
          </div>
        </ProfileCard>
      ))}
    </>
  );
};

export default memo(ProductsList);
