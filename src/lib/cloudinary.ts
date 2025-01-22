import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  url: string;
  [key: string]: any;
}

const uploadFile = async (fileBuffer: Buffer) => {
  if (!fileBuffer) return {};
  try {
    const response = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: process.env.CLOUDINARY_FOLDER_NAME },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );
        uploadStream.end(fileBuffer);
      }
    );
    if (!response?.url?.trim()) throw new Error("");
    return { public_id: response?.public_id, url: response?.url };
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Failed to upload file to cloudinary");
  }
};

const deleteFile = async (fileId: string) => {
  try {
    const res = await cloudinary.uploader.destroy(fileId, {resource_type : "image"});
    if(res) return true;
    return false;
  } catch (error) {
    throw new Error("Failed to delete file from cloudinary");
  }
};

export { cloudinary, uploadFile, deleteFile };
