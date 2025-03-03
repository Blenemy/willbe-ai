"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileCard from "../../profile/tabs/components/ProfileCard";
import EditProductDialog from "../components/EditProductDialog";
import { useCompany } from "@/hooks/useCompany";
import { ProductsAndServices } from "@/types/Company";

const ProductsAndServicesTab = () => {
  const { productsAndServices, deleteCompanyProductAndService } = useCompany({
    enableFetch: true,
  });
  const [selectedProduct, setSelectedProduct] =
    useState<ProductsAndServices | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = (product: ProductsAndServices) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setEditDialogOpen(true);
  };

  const handleDelete = (productId: number) => {
    deleteCompanyProductAndService({ id: productId });
  };

  return (
    <div className="px-6 flex flex-col gap-5">
      <h2 className="font-bold text-xl">Products & Services</h2>

      <div className="flex justify-end">
        <Button onClick={handleAddProduct}>Add</Button>
      </div>

      {productsAndServices && (
        <>
          {productsAndServices.map((product) => (
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
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </div>
            </ProfileCard>
          ))}
        </>
      )}

      <EditProductDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductsAndServicesTab;
