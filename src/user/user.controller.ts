import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@Request() req) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.userService.getUser(req.user),
    };
  }

  @Get('names')
  async getUsernames() {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.userService.getUsernames(),
    };
  }

  @Get('name/:id')
  async getUsername(@Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: 200,
      message: 'OK',
      data: (await this.userService.getUser(id)).name,
    };
  }
}
