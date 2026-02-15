import multer from 'multer'; // ✅ DEFAULT IMPORT (CRITICAL)
import { Request, Response } from 'express';
import { fileUploadByMulter } from './file-upload-by-multer';

export function uploadFile(
  req: Request,
  res: Response,
  folder: string,
  fieldName:string,
): Promise<Express.Multer.File | undefined> {
  const upload = multer(fileUploadByMulter(folder)).single(fieldName);

  return new Promise((resolve, reject) => {
    upload(req, res, (err: any) => {
      if (err) return reject(err);
      resolve(req.file);
    });
  });
}
