import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db/dbconnect";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
import { IProduct } from "@/types/product";
import { deleteImage } from "@/services/cloudinaryService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT" && req.method !== "DELETE") {
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
  const token = await getToken({ req });
  const providerId = token?.sub;

  if (!providerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await dbConnect();

  // delete product:
  if (req.method === "DELETE") {
    const { ean } = req.query;

    if (!ean || isNaN(Number(ean))) {
      return res
        .status(400)
        .json({ message: "'ean' is required and must be a number" });
    }

    const user = await User.findOne({ provider_id: providerId });

    if (!user) throw new Error("User not found");

    const productToDelete = user.products.find(
      (product) => product.ean === Number(ean),
    );

    if (!productToDelete) throw new Error("Product not found");

    if (productToDelete.public_id) {
      await deleteImage(productToDelete.public_id);
    }

    await User.updateOne(
      { provider_id: providerId },
      { $pull: { products: { ean: Number(ean) } } },
    );

    return res.status(200).json({ message: "Product deleted successfully" });
  }

  // update product:
  const {
    ean,
    name,
    brand,
    description,
    image,
    public_id,
    user_rating,
    user_note,
  } = req.body;

  // Überprüfe, ob 'ean' vorhanden und eine Zahl ist
  if (!ean || isNaN(Number(ean))) {
    return res
      .status(400)
      .json({ message: "'ean' is required and must be a number" });
  }

  // Erstelle 'productData' als 'IProduct'
  const productData: IProduct = {
    ean: Number(ean),
    name: name ?? undefined,
    brand: brand ?? undefined,
    description: description ?? undefined,
    image: image ?? undefined,
    public_id: public_id ?? undefined,
    user_rating: Number(user_rating) ?? undefined,
    user_note: user_note ?? undefined,
  };

  // Finde den Benutzer und aktualisiere das Produkt
  const result = await User.updateOne(
    {
      provider_id: providerId,
      "products.ean": productData.ean,
    },
    {
      $set: {
        "products.$.name": productData.name,
        "products.$.brand": productData.brand,
        "products.$.description": productData.description,
        "products.$.image": productData.image,
        "products.$.public_id": productData.public_id,
        "products.$.user_rating": productData.user_rating,
        "products.$.user_note": productData.user_note,
      },
    },
  );
  res.status(200).json({ message: "Product updated successfully", result });
  return;
}
