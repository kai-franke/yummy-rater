import cloudinary from "cloudinary";
import formidable from "formidable";
import { getToken } from "next-auth/jwt";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default async function handler(req, res) {
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
  const [ean] = fields.ean;

  const file = files.image[0];
  const result = await cloudinary.v2.uploader.upload(file.filepath, {
    folder: "nf",
    public_id: providerId + ean, // image name = providerId + ean -> neue Bilder überschreiben die alten
  });
  return res
    .status(200)
    .json({ message: "Image uploaded successfully", url: result.secure_url }); // todo: Auf keinen Fall result returnen! Es enthält den API Key!
}
