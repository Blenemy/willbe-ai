"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import EditProductDialog from "../components/EditProductDialog";
import { useCompany } from "@/hooks/useCompany";
import { ProductsAndServices } from "@/types/Company";
import DeleteDialog from "../components/DeleteDialog";
import ProductsList from "../components/ProductsList";

const ProductsAndServicesTab = () => {
  const { productsAndServices } = useCompany({
    enableFetch: true,
  });
  const [selectedProduct, setSelectedProduct] =
    useState<ProductsAndServices | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] =
    useState<ProductsAndServices | null>(null);

  const handleEdit = useCallback((product: ProductsAndServices) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  }, []);

  const handleAddProduct = useCallback(() => {
    setSelectedProduct(null);
    setEditDialogOpen(true);
  }, []);

  const handleDelete = useCallback((product: ProductsAndServices) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  }, []);

  return (
    <div className="px-6 flex flex-col gap-5">
      <h2 className="font-bold text-xl">Products & Services</h2>

      <div className="flex justify-end">
        <Button onClick={handleAddProduct}>Add</Button>
      </div>

      <ProductsList
        productsList={productsAndServices}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      <EditProductDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        product={selectedProduct}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        productToDelete={productToDelete}
      />
    </div>
  );
};

export default ProductsAndServicesTab;
