import {
  BadRequestException,
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { LoginGuard } from './login.guard';
import { OAuth2AuthGuard } from './oauth2-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(OAuth2AuthGuard)
  @Get('oauth')
  async oauth(@Res() res: Response) {}

  @UseGuards(OAuth2AuthGuard)
  @Get('authorize')
  async authorize(@Res() res: Response) {
    res.redirect('/');
  }

  @UseGuards(LoginGuard)
  @Get('token')
  async token(@Req() req: Request) {
    return {
      statusCode: 200,
      message: 'OK',
      data: { token: await this.authService.getJwtToken(req.user as User) },
    };
  }
}
