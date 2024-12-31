import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadSingleFile = upload.single('file');

export const uploadMultipleFiles = upload.array('files', 10);
