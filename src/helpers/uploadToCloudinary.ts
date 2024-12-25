import cloudinary from '../config/cloudinary';

export const uploadToCloudinary = async (
  filePath: string,
  folder: string
): Promise<{ url: string; public_id: string }> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};
