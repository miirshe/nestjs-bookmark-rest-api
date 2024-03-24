/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { UserDto } from './dto';
import { UserService } from './user.service';
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(
    @GetUser('id') userId: string,
    @Body() dto: UserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }
}
