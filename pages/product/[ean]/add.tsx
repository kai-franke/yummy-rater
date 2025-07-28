import ProductForm from "@/components/ProductForm";
import { IProduct } from "@/types/product";
import { useRouter } from "next/router";

export default function AddProductPage() {
  const router = useRouter();
  const { ean } = router.query;

  async function addProduct(data: IProduct) {
    const response = await fetch("/api/user/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to add product");
    }
    const result = await response.json();
    console.log("Product added successfully:", result);
  }

  return (
    <ProductForm onSubmit={addProduct} initialData={{ ean: String(ean) }} />
  );
}
