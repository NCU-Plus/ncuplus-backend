import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jewService: JwtService,
  ) {}

  // TODO: use portal OAuth2 create an account

  async getJwtToken(protalId: number) {
    const payload = {
      sub: (await this.userService.getUserByPortalId(protalId)).id,
    };
    return {
      statusCode: 200,
      message: 'OK',
      data: { token: await this.jewService.signAsync(payload) },
    };
  }
}
