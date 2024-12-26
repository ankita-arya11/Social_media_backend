import { Request, Response } from 'express';
import { uploadToCloudinary } from '../helpers/uploadToCloudinary';

export const fileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const folderName = 'images';
    const file = req.file;

    console.log('File uploaded at:', file.originalname);

    const uploadResult = await uploadToCloudinary(file, folderName);

    res.status(200).json({
      message: 'File uploaded successfully',
      mediaUrl: uploadResult.url,
    });
  } catch (error) {
    console.error('File Upload Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      message: 'Failed to upload file',
      error: errorMessage,
    });
  }
};
