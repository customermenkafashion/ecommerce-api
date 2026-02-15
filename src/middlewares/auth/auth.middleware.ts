import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: any, _: any, next: () => void) {
    const auth = req.headers.authorization;

    if (auth?.startsWith('Bearer ')) {
      req.user = this.jwtService.decode(auth.split(' ')[1]);
    }

    next();
  }
}
