// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   BadRequestException,
// } from '@nestjs/common';
// import { MulterError } from 'multer';

// @Catch(MulterError, BadRequestException)
// export class MulterExceptionFilter implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     console.log("errrrrrrrrrrrrrrrrrrr");
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();

//     response.status(400).json({
//       statusCode: 400,
//       message: exception.message || 'Invalid file upload',
//       error: 'Bad Request 11',
//     });
//   }
// }




import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { MulterError } from 'multer';

@Catch(MulterError, BadRequestException)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    console.log("fdgfgfffffffffffffffffffffffffffffffffffffd");
    console.log(exception.response.message);
    console.log("fdgfgfffffffffffffffffffffffffffffffffffffd");
    // const message = Array.isArray(exception.message)
    //   ? exception.message
    //   : [exception.message];

    const message = Array.isArray(exception.response.message)
      ? exception.response.message
      : [exception.response.message];

    response.status(400).json({
      statusCode: 400,
      message,
      error: 'Bad Request 11' ,
    });
  }
}
