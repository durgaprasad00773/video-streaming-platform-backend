import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath) return null;

            const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
            });

            console.log("the file is uploaded on cloudinary", response.url)
            return response
        } 
        catch (error) {
            fs.unlinkSync(localFilePath) //if file is not uploaded then it will delete the temporary saved file from local database
            return null
        }

}
export {uploadOnCloudinary}