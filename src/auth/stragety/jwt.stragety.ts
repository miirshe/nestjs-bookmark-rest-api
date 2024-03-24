/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

@Injectable()
export class JwtStragety extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    private prismaService: PrismaService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
  }) {
    const user =
      await this.prismaService.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

    delete user.password;

    return user;
  }
}
