import dbConnect from "@/lib/db/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import { findUserByProviderId } from "@/services/userService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "GET") {
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }

  const session = await getServerSession(request, response, authOptions);

  if (!session) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  await dbConnect();

  const token = await getToken({ req: request });
  const providerId = token?.sub;

  const user = await findUserByProviderId(providerId!);

  if (!user) {
    return response.status(404).json({ message: `User not found` });
  }

  response.status(200).json(user);
}
