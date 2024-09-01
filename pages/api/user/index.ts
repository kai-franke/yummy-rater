import dbConnect from "@/lib/db/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import { findUserByProviderId } from "@/services/userService";
import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "@/services/userService";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const session = await getServerSession(request, response, authOptions);

  if (!session) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  await dbConnect();

  const token = await getToken({ req: request });
  const providerId = token?.sub;

  if (request.method === "GET") {
    const user = await findUserByProviderId(providerId!);

    if (!user) {
      response.status(404).json({ message: `User not found` });
      return;
    }
    response.status(200).json(user);
    return;
  }
  if (request.method === "POST") {
    const newUser = await createUser(providerId!);
    response.status(201).json(newUser);
    return;
  } else {
    response.status(405).end(`Method ${request.method} Not Allowed`);
    return;
  }
}
