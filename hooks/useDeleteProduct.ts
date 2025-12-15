import { useState } from "react";
import { mutate } from "swr";
import { IProduct } from "@/types/product";

export function useDeleteProduct(callbacks: {
  onSuccess: (product: IProduct) => void;
  onError: (error: unknown) => void;
}) {
  const [open, setOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function askDelete(product: IProduct) {
    setProductToDelete(product);
    setOpen(true);
  }

  async function confirmDelete() {
    if (!productToDelete) return;

    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/user/products/${productToDelete.ean}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      mutate("/api/user"); // revalidate products

      callbacks.onSuccess(productToDelete);
    } catch (error) {
      callbacks.onError(error);
    } finally {
      setIsLoading(false);
      setOpen(false);
      setProductToDelete(null);
    }
  }

  function cancelDelete() {
    setOpen(false);
    setProductToDelete(null);
  }

  return {
    open,
    isLoading,
    productToDelete,
    askDelete,
    confirmDelete,
    cancelDelete,
  };
}
