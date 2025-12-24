import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      folder: "avatars",
    });

    // delete temp file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response; // 👈 MUST return FULL response
  } catch (error) {
    console.error("Cloudinary error:", error.message);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};
