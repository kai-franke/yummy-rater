import dbConnect from "@/lib/db/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";

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
    let user = await User.findOne({
      provider_id: providerId,
    });
    if (!user) {
      user = await User.create({
        provider_id: providerId,
        products: [],
      });
    }
    response.status(200).json(user);
  }
}
