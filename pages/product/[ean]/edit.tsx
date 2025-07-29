import ProductForm from "@/components/ProductForm";
import { IProduct } from "@/types/product";
import { IUser } from "@/types/user";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { mutate } from "swr";

export default function EditProductPage({ userData }: { userData: IUser }) {
  const router = useRouter();
  const { ean } = router.query;

  const productToEdit = userData.products?.find(
    (product: IProduct) => product.ean.toString() === ean
  );
  async function editProduct(data: IProduct) {
    const response = await fetch(`/api/user/products/${ean}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.error("Failed to edit product");
    } else {
      const result = await response.json();
      console.log("Product edited successfully:", result);
      mutate("/api/user"); // Revalidate the user data
      router.push(`/products`); // Redirect to the products page after editing
    }
  }

  return (
    <ProductForm
      onSubmit={editProduct}
      isEditMode
      initialData={productToEdit}
    />
  );
}
