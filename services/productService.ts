import { IProductNoMongoose } from "@/types/product";

interface APIResponse {
  code: string;
  product?: {
    brands?: string;
    product_name_de?: string;
    product_name?: string;
    image_url?: string;
    generic_name_de?: string;
    generic_name?: string;
  };
}

export async function getProductByEAN(
  ean: string
): Promise<IProductNoMongoose | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v3/product/${ean}.json`
    );

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error("API not responding as expected.");
        case 404:
          throw new Error("No product data available.");
        default:
          throw new Error(`Error: ${response.status}`);
      }
    }

    const data: APIResponse = await response.json();

    if (data.product) {
      const sanitizedProduct: IProductNoMongoose = {
        ean: Number(data.code),
        name:
          data.product.product_name_de ||
          data.product.product_name ||
          "Unknown product name",
        brand: data.product.brands || "Unknown brand name",
        image: data.product.image_url || "",
        description:
          data.product.generic_name_de || data.product.generic_name || "",
        user_rating: undefined,
        user_note: undefined,
      };
      return sanitizedProduct;
    } else {
      throw new Error("Product data not available!!!");
    }
  } catch (error) {
    throw error;
  }
}
