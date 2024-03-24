/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async editUser(userId: string, dto: UserDto) {
    const userIsExist =
      await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!userIsExist) {
      throw new ForbiddenException(
        'user not found',
      );
    }

    const user =
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });

    if (!user) {
      throw new ForbiddenException(
        'something went wrong',
      );
    }

    return { msg: 'successfully updated user' };
  }
}
