import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db/dbconnect";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
import { IProduct } from "@/types/product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
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

  const { ean, name, brand, description, image, user_rating, user_note } =
    req.body;

  // Überprüfe, ob 'ean' vorhanden und eine Zahl ist
  if (!ean || isNaN(Number(ean))) {
    return res
      .status(400)
      .json({ message: "'ean' is required and must be a number" });
  }

  // Erstelle 'productData' als 'IProduct'
  const productData: IProduct = {
    ean: Number(ean),
    name: name || undefined,
    brand: brand || undefined,
    description: description || undefined,
    image: image || undefined,
    user_rating: user_rating ? Number(user_rating) : undefined,
    user_note: user_note || undefined,
    // 'createdAt' wird von Mongoose automatisch gesetzt
  };

  // Finde den Benutzer
  const user = await User.findOne({ provider_id: providerId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Füge das Produkt hinzu
  user.products.push(productData);
  await user.save();

  res.status(200).json({ message: "Product added successfully", user });
}
