"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import EditProductDialog from "../components/EditProductDialog";
import { useCompany } from "@/hooks/useCompany";
import { ProductsAndServices } from "@/types/Company";
import DeleteDialog from "../components/DeleteDialog";
import ProductsList from "../components/ProductsList";
import ProductsAndServicesSkeleton from "../skeletons/products-and-services-skeleton";
import { useTranslations } from "next-intl";

const ProductsAndServicesTab = () => {
  const { productsAndServices, productsAndServicesLoading } = useCompany({
    enableFetch: true,
  });
  const t = useTranslations("Company");
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

  if (productsAndServicesLoading) {
    return <ProductsAndServicesSkeleton />;
  }

  return (
    <div className="px-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">{t("products_and_services")}</h2>

        <div className="flex justify-end">
          <Button onClick={handleAddProduct}>{t("add_product")}</Button>
        </div>
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
