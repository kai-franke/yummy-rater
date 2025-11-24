import ProductForm from "@/components/ProductForm";
import { getProductByEAN } from "@/services/productService";
import { IProduct } from "@/types/product";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { useEffect, useState } from "react";

export default function AddProductPage() {
  const router = useRouter();
  const { ean } = router.query;
  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await getProductByEAN(String(ean));
        setProduct(productData);
      } catch (error) {
        setProduct({ ean: Number(ean) });
        console.error("Error fetching product data:", error);
      }
    }
    fetchProduct();
  }, [ean]);

  async function addProduct(data: IProduct) {
    const response = await fetch("/api/user/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.error("Failed to add product");
      // todo: Error handling with Toast Message
    } else {
      const result = await response.json();
      console.log("Product added successfully:", result);
      mutate("/api/user"); // Revalidate the user data
      router.push(`/products`); // Redirect to the products page after editing
    }
  }

  if (!product) return null; // Early return while useEffect is fetching data and no product is set yet

  return (
    <ProductForm
      onSubmit={addProduct}
      initialData={product ? product : { ean: String(ean) }}
    />
  );
}
