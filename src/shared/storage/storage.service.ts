import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  async saveFile(filePath: string, data: Buffer) {
    const fullPath = path.join(__dirname, '..', '..', 'uploads', filePath);
    fs.writeFileSync(fullPath, data);
    this.logger.log(`File saved to ${fullPath}`);
    return fullPath;
  }

  async deleteFile(filePath: string) {
    const fullPath = path.join(__dirname, '..', '..', 'uploads', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      this.logger.log(`File deleted: ${fullPath}`);
    }
  }
}
