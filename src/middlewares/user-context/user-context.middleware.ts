import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class UserContextMiddleware implements NestMiddleware {
  use(req: any, _: any, next: () => void) {
    req.context = {
      userId: req.user?.sub || null,
      role: req.user?.role || 'guest',
      requestId: req.requestId,
    };
    next();
  }
}
