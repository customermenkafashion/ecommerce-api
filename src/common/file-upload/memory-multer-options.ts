import { memoryStorage } from 'multer';

export const memoryMulterOptions = {
  storage: memoryStorage(),
};
