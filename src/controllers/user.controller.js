import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
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

  // Require password and either email or username
  if (!password || (!email && !username)) {
    throw new ApiError(400, "Password and either email or username are required");
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
    throw new ApiError(401, "Invalid Password");
  }

  //accesstoken and refreshtoken

  const {accessToken, refreshToken} = await generateTokens(user._id);

  const loggedInUser = await User.findById(user._id)
  .select("-password -refreshToken")
  //send cookie

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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
  await User.findByIdAndUpdate(
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  }

  return res
  .status(200)
  .clearCookie("accessToken", cookieOptions)
  .clearCookie("refreshToken", cookieOptions)
  .json(new ApiResponse(200,{}, "LoggedOut Successfully"))

})

const refreshAccessToken = asyncHandler(async(req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if(!incomingRefreshToken)
  {
    throw new ApiError(401, "Unauthorized request");
  }


  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decodedToken._id);

  if(!user)
  {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  if(user?.refreshToken !== incomingRefreshToken)
  {
    throw new ApiError(401, "Refresh token revoked or reused");
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

  res.status(200)
  .cookie("refreshToken", newRefreshToken, cookieOptions)
  .cookie("accessToken", accessToken, cookieOptions)
  .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access Token Refreshed"));

})


const changePassword = asyncHandler(async(req, res) => {
  const {oldPassword, newPassword} = req.body;

  const user = await User.findById(req.user._id);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if(!isPasswordValid)
  {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save({validateBeforeSave : false});


  return res.status(200)
  .json(new ApiResponse(200, {}, "Password Changed Successfully"))

})

const getCurrentUser = asyncHandler(async(req, res) => {
  return res.status(200)
  .json(new ApiResponse(200, {user : req.user}, "Current user fetched successfully"));
})

const updateAccountDetails = asyncHandler(async(req, res) => {
  const {fullName, username} = req.body;

  if(!fullName?.trim() || !username?.trim())
  {
    throw new ApiError(400, "Full name and username are required");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set : {
        fullName, username
      }
    },
    { new : true }
  ).select("-password -refreshToken");
  return res.status(200)
  .json(new ApiResponse(200, {user : updatedUser}, "Account details updated successfully"));

});


const updatedUserAvatar = asyncHandler(async(req, res) => {
  const avatarLocalPath = req.file?.path;
  if(!avatarLocalPath)
  {
    throw new ApiError(400, "Avatar file is required");
  }
  
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if(!avatar.secure_url)
  {
    throw new ApiError(500, "Avatar upload failed");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set : {
        avatar : avatar.secure_url
      }
    },
    { new : true }
  ).select("-password -refreshToken");

  return res.status(200)
  .json(new ApiResponse(200, {user : updatedUser}, "Avatar updated successfully"));

})

const updatedUserCoverImage = asyncHandler(async(req, res) => {
  const coverLocalPath = req.file?.path;
  if(!coverLocalPath)
  {
    throw new ApiError(400, "Cover image file is required");
  }

  const cover = await uploadOnCloudinary(coverLocalPath);

  if(!cover.secure_url)
  {
    throw new ApiError(500, "Cover image upload failed");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set : {
        coverImage : cover.secure_url
      }
    },
    { new : true }
  ).select("-password -refreshToken");

  return res.status(200)
  .json(new ApiResponse(200, {user : updatedUser}, "Cover image updated successfully"));

})



export { registeruser, loginuser , logoutuser, refreshAccessToken, changePassword, getCurrentUser, updateAccountDetails , updatedUserAvatar, updatedUserCoverImage};