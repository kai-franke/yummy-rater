import dbConnect from "@/lib/db/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import { createUser, findUserByProviderId } from "@/services/userService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "POST") {
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }

  const session = await getServerSession(request, response, authOptions);
  if (!session) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  await dbConnect();

  const token = await getToken({ req: request });
  const providerId = token?.sub;

  const existingUser = await findUserByProviderId(providerId!);
  if (existingUser) {
    return response
      .status(409)
      .json({ message: "User already exists" });
  }

  const newUser = await createUser(providerId!);
  response.status(201).json(newUser);
}
