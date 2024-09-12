export async function findProductByEAN(ean: string) {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v3/product/${ean}.json`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch product data for EAN ${ean}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product data:", error);
    throw error;
  }
}
