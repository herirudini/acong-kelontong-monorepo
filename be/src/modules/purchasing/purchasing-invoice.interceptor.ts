import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { applyDecorators, UseInterceptors } from '@nestjs/common';

export function UploadInvoiceInterceptor(fieldName = 'invoice_photo') {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const uuidFolder = uuidv4();
            const uploadPath = path.join('./uploads/invoices', uuidFolder);
            fs.mkdirSync(uploadPath, { recursive: true });

            // Store folder name in request (so controller can use it)
            (req as any).uuidFolder = uuidFolder;
            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            cb(null, file.originalname); // keep original filename
          },
        }),
      }),
    ),
  );
}
