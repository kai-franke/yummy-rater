// Nur zum Testen der Datenbank

import type { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "@/services/userService";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    try {
      const userData = request.body;

      const newUser = await createUser(userData);
      return response.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return response.status(405).json({ error: "Method Not Allowed" });
  }
}
