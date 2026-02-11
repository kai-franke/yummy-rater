import cloudinary from "cloudinary";
import formidable from "formidable";

// Cloudinary konfigurieren
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function deleteImage(publicId?: string) {
  if (!publicId) return;
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (err) {
    console.error("Fehler beim Löschen des Bildes:", err);
    throw err;
  }
}
export async function createImage(file: formidable.File) {
  return await cloudinary.v2.uploader.upload(file.filepath, {
    folder: "yummys",
  });
}
