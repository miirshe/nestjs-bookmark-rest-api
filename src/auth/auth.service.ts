/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    try {
      const hash = await argon2.hash(
        dto.password,
      );
      const user =
        await this.prismaService.user.create({
          data: {
            email: dto.email,
            password: hash,
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        });
      delete user.password;
      return user;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
        throw error;
      }
    }
  }

  async signin(dto: AuthDto) {
    const user =
      await this.prismaService.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (!user) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }
    const pwMatch = await argon2.verify(
      user.password,
      dto.password,
    );
    if (!pwMatch) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }
    delete user.password;

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET_KEY'),
      },
    );

    return {
      token: token,
    };
  }
}
