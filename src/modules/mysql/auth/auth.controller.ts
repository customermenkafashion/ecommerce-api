import {UseGuards,Controller, Req,Res, Get, Post, Body, Patch, Param, Delete, UploadedFile, 
  BadRequestException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { memoryMulterOptions } from '../../../common/file-upload/memory-multer-options';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@Req() req) {
    return this.authService.logout(req.user);
  }

}
