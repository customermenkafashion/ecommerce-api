import multer from 'multer';

export const memoryMulter = multer({
  storage: multer.memoryStorage(),
});
