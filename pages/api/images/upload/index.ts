import { createImage } from "@/services/cloudinaryService";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const token = await getToken({ req });
  const providerId = token?.sub;

  if (!providerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // {} means use the standard options, no extra options specified
  const form = formidable({});
  const [fields, files] = await form.parse(req);

  let ean: string;

  if (Array.isArray(fields.ean)) {
    ean = fields.ean[0]; // first item from array
  } else if (typeof fields.ean === "string") {
    ean = fields.ean; // or directly the string
  } else {
    throw new Error("EAN fehlt");
  }
  if (files.image) {
    const result = await createImage(files.image[0]);

    return res.status(200).json({
      message: "Image uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  }
}
