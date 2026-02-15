import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

export function saveFileToDisk(
  file: Express.Multer.File,
  folder: string,
): string {
  const uploadPath = join(process.cwd(), 'uploads', folder);

  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  const filename =
    `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
    extname(file.originalname);

  writeFileSync(join(uploadPath, filename), file.buffer);

  return "uploads/"+folder+"/"+filename;
}
