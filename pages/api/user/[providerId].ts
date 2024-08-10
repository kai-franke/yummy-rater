import type { NextApiRequest, NextApiResponse } from "next";
import { getUserByProviderId } from "@/services/userService";
import { ISanitizedUser } from "@/types/user";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { providerId } = request.query;

  if (!providerId || typeof providerId !== "string") {
    return response.status(400).json({
      error: "Invalid provider_ID",
      provider_ID: providerId,
      type: typeof providerId,
    });
  }

  try {
    const user = await getUserByProviderId(providerId);

    if (user) {
      return response.status(200).json(user as ISanitizedUser);
    } else {
      return response
        .status(404)
        .json({ error: "User not found", provider_ID: providerId });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}
