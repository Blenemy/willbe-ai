"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileCard from "../../profile/tabs/components/ProfileCard";
import EditProductDialog from "../components/EditProductDialog";

export interface Product {
  id: number;
  title: string;
  description: string;
}

const initialProducts: Product[] = [
  {
    id: 1,
    title: "Web Dev",
    description: "We provide high-quality web development services...",
  },
  {
    id: 2,
    title: "SEO",
    description: "Optimize your website for search engines...",
  },
];

const ProductsAndServicesTab = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setEditDialogOpen(true);
  };

  return (
    <div className="px-6 flex flex-col gap-5">
      <h2 className="font-bold text-xl">Products & Services</h2>

      <div className="flex justify-between items-center">
        <Button variant="outline">Show all items</Button>
        <Button onClick={handleAddProduct}>Add</Button>
      </div>

      {products.map((product) => (
        <ProfileCard key={product.id} title={product.title}>
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

      <EditProductDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        product={selectedProduct}
        setProducts={setProducts}
      />
    </div>
  );
};

export default ProductsAndServicesTab;
