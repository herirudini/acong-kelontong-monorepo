import { 
  ConflictException, 
  ForbiddenException, 
  InternalServerErrorException, 
  NotFoundException, 
  UnauthorizedException, 
  BadRequestException 
} from '@nestjs/common';

import { IBaseResponse, IResponse } from 'src/types/interfaces';

export class BaseResponse {
  static success<T>(cfg: IBaseResponse = {}): T {
    const option: IResponse = { message: 'Success', ...cfg.option };
    if (!cfg.res) return { success: true, ...option } as unknown as T;
    return cfg.res.status(200).json({ success: true, ...option }) as T;
  }

  static unexpected<T>(cfg: IBaseResponse = {}): T {
    const option: IResponse = { message: 'Internal Server Error', error_code: '500', ...cfg.option };
    console.error(option, cfg.err);
    if (!cfg.res) throw new InternalServerErrorException(option);
    return cfg.res.status(500).json({ success: false, ...option }) as T;
  }

  static unauthorized<T>(cfg: IBaseResponse = {}): T {
    const option: IResponse = { message: 'Unauthorized', error_code: '401', ...cfg.option };
    console.error(option, cfg.err);
    if (!cfg.res) throw new UnauthorizedException(option);
    return cfg.res.status(401).json({ success: false, ...option }) as T;
  }

  static forbidden<T>(cfg: IBaseResponse = {}): T {
    const option: IResponse = { message: 'Forbidden', error_code: '403', ...cfg.option };
    console.error(option, cfg.err);
    if (!cfg.res) throw new ForbiddenException(option);
    return cfg.res.status(403).json({ success: false, ...option }) as T;
  }

  static notFound<T>(cfg: IBaseResponse = {}): T {
    const option: IResponse = { message: 'Data Not Found', error_code: '404', ...cfg.option };
    console.error(option, cfg.err);
    if (!cfg.res) throw new NotFoundException(option);
    return cfg.res.status(404).json({ success: false, ...option }) as T;
  }

  static conflict<T>(cfg: IBaseResponse = {}): T {
    const option: IResponse = { message: 'Data Already Exist', error_code: '409', ...cfg.option };
    console.error(option, cfg.err);
    if (!cfg.res) throw new ConflictException(option);
    return cfg.res.status(409).json({ success: false, ...option }) as T;
  }

  static invalid<T>(cfg: IBaseResponse = {}): T {
    const option: IResponse = { message: 'Invalid Request', error_code: '400', ...cfg.option };
    console.error(option, cfg.err);
    if (!cfg.res) throw new BadRequestException(option);
    return cfg.res.status(400).json({ success: false, ...option }) as T;
  }
}
