import { fileTypeFromFile } from 'file-type';
import fs from 'fs';
import sharp from 'sharp';

const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const validateImage = async (file) => {
  if (!file || file.fieldname !== 'image') {
    return { success: false, message: 'Không có ảnh' };
  }
  const filePath = file.path;
  // Kiểm tra loại file bằng magic number
  const type = await fileTypeFromFile(filePath);

  if (!type || !ALLOWED_IMAGE_MIME_TYPES.includes(type.mime)) {
    return { success: false, message: 'Ảnh không lệ' };
  }
  return { success: true, message: 'Không có ảnh' };
};

export const resizeImage = async (inputPath, filename) => {
  const resizedFilename = `resized-${filename}.webp`;
  const resizedPath = `uploads/${resizedFilename}`;

  try {
    await sharp(inputPath)
      .resize(800, 800, { fit: 'inside' })
      .toFormat('webp')
      .toFile(resizedPath);

    // Xoá ảnh gốc
    fs.unlinkSync(inputPath);

    return {
      success: true,
      data: {
        path: resizedPath,
        filename: resizedFilename,
        mimetype: 'image/webp',
      },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Không thể resize ảnh: ' + error.message,
    };
  }
};
