import {v2 as cloudinary} from "cloudinary";
import fs from "fs/promises";
import {ApiError} from "../responses";
import "dotenv/config";

interface CloudinaryResponse {
  public_id: string;
  url: string;
  secure_url: string;
  width?: number;
  height?: number;
  format: string;
  resource_type: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (
  localFilePath: string,
  customFileName?: string,
): Promise<CloudinaryResponse | null> => {
  try {
    if (!localFilePath) {
      throw new ApiError(400, "Local file path is required", "BAD_REQUEST");
    }
    try {
      await fs.access(localFilePath);
    } catch {
      throw new ApiError(404, "Local file not found", "NOT_FOUND");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "leet-master",
      public_id: customFileName,
      use_filename: !customFileName,
      unique_filename: !customFileName,
      overwrite: true,
    });

    await fs.unlink(localFilePath);
    return response as CloudinaryResponse;
  } catch (error) {
    try {
      if (localFilePath) await fs.unlink(localFilePath);
    } catch (cleanupError) {
      console.error("Failed to clean up local file:", cleanupError);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      "Failed to upload file to Cloudinary",
      "INTERNAL_ERROR",
    );
  }
};

const deleteOnCloudinary = async (
  public_id: string,
  resource_type: string = "image",
): Promise<void> => {
  try {
    if (!public_id) {
      throw new ApiError(400, "Public ID is required");
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type,
    });

    if (result.result !== "ok") {
      throw new ApiError(404, "File not found on Cloudinary");
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      500,
      "Failed to delete file from Cloudinary",
      "INTERNAL_ERROR",
    );
  }
};

export {uploadOnCloudinary, deleteOnCloudinary};
export type {CloudinaryResponse};
