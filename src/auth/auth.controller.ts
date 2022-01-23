import { Body, Controller, ParseIntPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // TODO: implement portal OAuth2 guard
  @Post('token')
  async getJwtToken(@Body('portalId', ParseIntPipe) portalId: number) {
    try {
      return await this.authService.getJwtToken(portalId);
    } catch (error) {
      throw error;
    }
  }
}
