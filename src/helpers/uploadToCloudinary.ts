import cloudinary from '../config/cloudinary';

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string
): Promise<{ url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          reject(new Error('Failed to upload file to Cloudinary'));
        } else {
          resolve({
            url: result?.secure_url || '',
            public_id: result?.public_id || '',
          });
        }
      }
    );

    stream.end(file.buffer);
  });
};
