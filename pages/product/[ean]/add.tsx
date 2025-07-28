import ProductForm from "@/components/ProductForm";
import { IProduct } from "@/types/product";
import { useRouter } from "next/router";
import { mutate } from "swr";

export default function AddProductPage() {
  const router = useRouter();
  const { ean } = router.query;

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
      // todo: Error handling mit Toast Message
    } else {
      const result = await response.json();
      console.log("Product added successfully:", result);
      mutate("/api/user"); // Revalidate the user data
      router.push(`/products`); // Redirect to the products page after editing
    }
  }

  return (
    <ProductForm onSubmit={addProduct} initialData={{ ean: String(ean) }} />
  );
}
