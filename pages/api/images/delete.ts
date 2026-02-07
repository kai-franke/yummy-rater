import { getToken } from "next-auth/jwt";
import { deleteImage } from "@/services/cloudinaryService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const token = await getToken({ req });
  const providerId = token?.sub;

  if (!providerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const id = req.body;
  if (id) {
    await deleteImage(id);
    return res.status(200).json({ message: "Image deleted successfully" });
  } else {
    return res
      .status(400)
      .json({ message: "Image ID missing - Nothing deleted" });
  }
}
