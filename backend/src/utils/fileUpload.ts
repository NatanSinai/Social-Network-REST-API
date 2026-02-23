import { randomUUID } from 'crypto';
import { unlink } from 'fs/promises';
import multer from 'multer';
import { basename, extname, join, resolve } from 'path';
import { envVar } from './env';
import { ensureDirectoryExists } from './helpers';

ensureDirectoryExists(envVar.FILE_UPLOADS_BASE_PATH);

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

const uploadsDirectoryAbsolutePath = resolve(envVar.FILE_UPLOADS_BASE_PATH);

export const deleteFile = async (filePathFromDB: string) => {
  const fullPath = join(uploadsDirectoryAbsolutePath, basename(filePathFromDB));

  try {
    await unlink(fullPath);
    console.log('File deleted:', fullPath);
  } catch (error) {
    console.warn('File delete failed:', (error as Error).message);
  }
};
