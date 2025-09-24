import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AppError } from 'src/utils/base-response';

@Catch()
export class ErrResFactory implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof AppError) {
      return res.status(exception.statusCode).json({
        success: false,
        message: exception.message,
        error_code: exception.errorCode,
        details: exception.details,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      return res.status(status).json({
        success: false,
        ...(typeof response === 'string' ? { message: response } : response),
      });
    }

    // fallback for unexpected errors
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}
