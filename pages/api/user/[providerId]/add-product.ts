// Nur zum Testen der Datenbank

import type { NextApiRequest, NextApiResponse } from "next";
import { addProductToUser } from "@/services/userService";
import { IProduct } from "@/types/product";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { providerId } = request.query;

  if (request.method === "PATCH") {
    if (!providerId || typeof providerId !== "string") {
      return response.status(400).json({
        error: "Invalid provider_ID",
        provider_ID: providerId,
        type: typeof providerId,
      });
    }

    const productData: IProduct = request.body;

    try {
      const updatedUser = await addProductToUser(providerId as string, productData);

      if (updatedUser) {
        return response.status(200).json(updatedUser);
      } else {
        return response.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error adding product to user:", error);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return response.status(405).json({ error: "Method Not Allowed" });
  }
}
