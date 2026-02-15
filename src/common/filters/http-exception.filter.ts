// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
// } from '@nestjs/common';

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     const status = exception.getStatus();

//     response.status(status).json({
//       success: false,
//       message: exception.message,
//       statusCode: status,
//     });
//   }
// }




import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
console.log("hhhhhhh");
      console.log(exception);
    const res: any = exception.getResponse();
    let errors: Record<string, string> | null = null;

    const flattenErrors = (errs: ValidationError[], parentKey = ''): Record<string, string> => {
      let acc: Record<string, string> = {};
      console.log("rrrr");
      console.log(errs);
      errs.forEach(err => {
        const key = parentKey ? `${parentKey}.${err.property}` : err.property;

        if (err.constraints) {
          // Take only the first error per field
          acc[key] = Object.values(err.constraints)[0];
        }

        if (err.children && err.children.length) {
          acc = { ...acc, ...flattenErrors(err.children, key) };
        }
      });
      return acc;
    };

    if (Array.isArray(res?.message)) {
      errors = flattenErrors(res.message);
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
      errors: errors,
    };

    response.status(status).json(errorResponse);
  }
}
