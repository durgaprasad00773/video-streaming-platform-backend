import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

//method to generate tokens

const generateTokens =async(userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false});

    return {accessToken, refreshToken};
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating tokens");
  }

}


const registeruser = asyncHandler(async (req, res) => {

  // Extract fields
  const { username, email, fullName, password } = req.body;

  //Validate input
  if ([username, email, fullName, password].some(field => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  //Check existing user
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "Username or email already exists");
  }

  // Get file paths from multer
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  // Avatar is mandatory
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const cover = coverLocalPath
    ? await uploadOnCloudinary(coverLocalPath)
    : null;

    console.log("Cloudinary response:", avatar)

  if (!avatar?.secure_url) {
    throw new ApiError(400, "Avatar upload failed");
  }

  // Create user
  const user = await User.create({
    fullName,
    username,
    email,
    password,
    avatar: avatar.secure_url,
    coverImage: cover?.secure_url || "",
  });

  //Remove sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  // Success response
  return res.status(201).json(
    new ApiResponse(201, createdUser, "Registered successfully")
  );
});


const loginuser = asyncHandler(async(req, res) => {
  //getting data

  const {email, username, password} = req.body;

  //checking all data is present

  if(!password || !email ||!username)
  {
    throw new ApiError(400, "All fields are required");
  }

  //find the user
  const user = await User.findOne({
    $or : [{email}, {username}]
  })

  if(!user)
  {
    throw new ApiError(404, "user not found");
  }

  //check password

  const isPasswordValid = await user.isPasswordCorrect(password);

  if(!isPasswordValid)
  {
    throw new ApiError(404, "Invalid Password");
  }

  //accesstoken and refreshtoken

  const {accessToken, refreshToken} = await generateTokens(user._id);

  const loggedInUser = await User.findById(user._id)
  .select("-password -refreshToken")
  //send cookie

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  }

  return res.status(200)
  .cookie("accessToken", accessToken, cookieOptions)
  .cookie("refreshToken", refreshToken, cookieOptions)
  .json(
    new ApiResponse(200,
      {
        user : loggedInUser, refreshToken, accessToken
      },
      "Loggedin Successfully"
    )
  )
});


const logoutuser = asyncHandler(async(req, res) => {
  User.findByIdAndUpdate(
    req.user._id, 
    {
      $set : {
        refreshToken : undefined
      }
    }, 
    {
      new : true
    })

    const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  }

  return res
  .status(200)
  .clearCookie("accessToken", cookieOptions)
  .clearCookie("refreshToken", cookieOptions)
  .json(new ApiResponse(200,{}, "LoggedOut Successfully"))

})
export { registeruser, loginuser , logoutuser};
