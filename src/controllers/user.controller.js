import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registeruser = asyncHandler(async (req, res) => {

  // 1️⃣ Extract fields
  const { username, email, fullName, password } = req.body;

  // 2️⃣ Validate input
  if ([username, email, fullName, password].some(field => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // 3️⃣ Check existing user
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "Username or email already exists");
  }

  // 4️⃣ Get file paths from multer
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  // 5️⃣ Avatar is mandatory
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 6️⃣ Upload to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const cover = coverLocalPath
    ? await uploadOnCloudinary(coverLocalPath)
    : null;

    console.log("Cloudinary response:", avatar)

  if (!avatar?.secure_url) {
    throw new ApiError(400, "Avatar upload failed");
  }

  // 7️⃣ Create user
  const user = await User.create({
    fullName,
    username,
    email,
    password,
    avatar: avatar.secure_url,
    coverImage: cover?.secure_url || "",
  });

  // 8️⃣ Remove sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  // 9️⃣ Success response
  return res.status(201).json(
    new ApiResponse(201, createdUser, "Registered successfully")
  );
});

export { registeruser };
