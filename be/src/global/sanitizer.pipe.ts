import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
} from '@nestjs/common';
import { sanitizeObject } from 'src/utils/sanitizer';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    return sanitizeObject(value);
  }
}
