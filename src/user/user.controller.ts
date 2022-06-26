import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async getUsers() {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.userService.getUsers(),
    };
  }

  @Get('users/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUser(id);
    if (!user) throw new NotFoundException(`User with id ${id} does not exist`);
    return {
      statusCode: 200,
      message: 'OK',
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('profiles/:id')
  async updateProfile(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body('profile', new ValidationPipe({ transform: true }))
    profile: UpdateProfileDto,
  ) {
    if ((req.user as User).profile.id !== id)
      throw new ForbiddenException("You can't update other user's profile");
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.userService.updateProfile(
        (req.user as User).id,
        profile,
      ),
    };
  }
}
