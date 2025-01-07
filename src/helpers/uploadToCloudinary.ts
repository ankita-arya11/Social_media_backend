import cloudinary from '../config/cloudinary';

export const uploadToCloudinary = async (
  files: Express.Multer.File[],
  folder: string
): Promise<{ url: string; public_id: string }[]> => {
  const uploadPromises = files.map((file) => {
    return new Promise<{ url: string; public_id: string }>(
      (resolve, reject) => {
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
      }
    );
  });

  return Promise.all(uploadPromises);
};

export const singleUploadToCloudinary = async (
  files: Express.Multer.File,
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
    stream.end(files.buffer);
  });
};
