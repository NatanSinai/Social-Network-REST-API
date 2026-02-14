import { randomUUID } from 'crypto';
import multer from 'multer';
import { extname } from 'path';
import { envVar } from './env';

const diskStorageEngine = multer.diskStorage({
  destination: (request, file, callback) => callback(null, `${envVar.FILE_UPLOADS_BASE_PATH}/`),
  filename: (request, file, callback) => {
    const filePathExtension = extname(file.originalname);

    const filename = `${randomUUID()}-${filePathExtension}` as const;

    callback(null, filename);
  },
});

export const upload = multer({
  storage: diskStorageEngine,
  fileFilter: (request, file, callback) => {
    const isImageFile = file.mimetype.startsWith('image/');

    if (isImageFile) return callback(null, true);

    callback(new Error('Only images allowed'));
  },
});
