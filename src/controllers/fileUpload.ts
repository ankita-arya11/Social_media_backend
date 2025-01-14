import { Request, Response } from 'express';
import {
  singleUploadToCloudinary,
  uploadToCloudinary,
} from '../helpers/uploadToCloudinary';

export const mulipleFileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const folderName = 'images';
    const files = req.files as Express.Multer.File[];

    const uploadResults = await uploadToCloudinary(files, folderName);

    const mediaUrls = uploadResults.map((result) => result.url);

    res.status(200).json({
      message: 'File uploaded successfully',
      mediaUrls,
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

export const singleFileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const folderName = 'images';
    const file = req.file;

    const uploadResults = await singleUploadToCloudinary(file, folderName);

    res.status(200).json({
      message: 'File uploaded successfully',
      mediaUrl: uploadResults.url,
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
