/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async createBookMark(
    userId: string,
    dto: BookmarkDto,
  ) {
    const bookmark =
      await this.prismaService.bookmark.create({
        data: {
          title: dto.title,
          description: dto.description,
          link: dto.link,
          userId: userId,
        },
      });

    if (!bookmark) {
      throw new ForbiddenException(
        'Bookmark creation failed',
      );
    }
    return {
      msg: 'bookmark created successfully',
    };
  }

  async editBookMark(
    id: string,
    userId: string,
    dto: BookmarkDto,
  ) {
    const isExistBookMark =
      await this.prismaService.bookmark.findUnique(
        {
          where: {
            id: id,
          },
        },
      );

    if (!isExistBookMark) {
      throw new ForbiddenException(
        'BookMark not exist',
      );
    }

    const bookMark =
      await this.prismaService.bookmark.update({
        where: {
          id: id,
        },
        data: {
          title: dto.title,
          description: dto.description,
          link: dto.link,
          userId: userId,
        },
      });

    if (!bookMark) {
      throw new ForbiddenException(
        'Bookmark update failed',
      );
    }

    return {
      msg: 'Bookmark updated successfully',
    };
  }

  async deleteBookMark(id: string) {
    const isExistBookMark =
      await this.prismaService.bookmark.findUnique(
        {
          where: {
            id: id,
          },
        },
      );
    if (!isExistBookMark) {
      throw new ForbiddenException(
        'BookMark not exist',
      );
    }

    const bookMark =
      await this.prismaService.bookmark.delete({
        where: {
          id: id,
        },
      });

    if (!bookMark) {
      throw new ForbiddenException(
        'Bookmark delete failed',
      );
    }

    return {
      msg: 'Bookmark deleted successfully',
    };
  }

  async getUserBookMarks(userId: string) {
    const bookMark =
      await this.prismaService.bookmark.findMany({
        where: {
          userId: userId,
        },
      });

    if (bookMark.length == 0) {
      throw new ForbiddenException(
        'BookMark not exists',
      );
    }

    return { data: bookMark };
  }
}
