import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
  try {
    const res = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    );
    console.log("UPLOAD SUCCESS:", res.secure_url);
  } catch (err) {
    console.error("UPLOAD FAILED:", err);
  }
})();
