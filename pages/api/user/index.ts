import dbConnect from "@/lib/db/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import { findUserByEmail, findOrCreateUser } from "@/services/userService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const session = await getServerSession(request, response, authOptions);

  if (!session || !session.user?.email) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  await dbConnect();

  const token = await getToken({ req: request });
  const providerId = token?.sub;
  const email = session.user.email;

  if (request.method === "GET") {
    const user = await findUserByEmail(email);

    if (!user) {
      response.status(404).json({ message: `User not found` });
      return;
    }
    response.status(200).json(user);
    return;
  }
  if (request.method === "POST") {
    const newUser = await findOrCreateUser(providerId!, email);
    response.status(201).json(newUser);
    return;
  } else {
    response.status(405).end(`Method ${request.method} Not Allowed`);
    return;
  }
}
