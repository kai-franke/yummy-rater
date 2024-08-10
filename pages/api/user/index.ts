// Nur zum Testen der Datenbank

import type { NextApiRequest, NextApiResponse } from "next";
import { createUser, getUserByProviderId } from "@/services/userService";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    try {
      const userData = request.body;

      // Prüfen, ob ein Benutzer mit der gleichen providerId bereits existiert
      const existingUser = await getUserByProviderId(userData.provider_id);

      if (existingUser) {
        return response.status(409).json({ error: "User with this providerId already exists." });
      }

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
