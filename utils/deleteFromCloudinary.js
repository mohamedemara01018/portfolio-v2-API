import cloudinary from "../config/cloudinary.js"
import { getPublicIdFromUrl } from "./getPublicIdFromUrl.js"

export const deleteFromCloudinary = async (url) => {
    if (!url) throw new Error("Image URL is required");

    const public_id = getPublicIdFromUrl(url);
    console.log(public_id)

    try {
        const result = await cloudinary.uploader.destroy(public_id);
        console.log(result)
        if (result.result !== "ok") {
            throw new Error("Failed to delete image from Cloudinary");
        }


        return result;
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);
        throw error;
    }
};
