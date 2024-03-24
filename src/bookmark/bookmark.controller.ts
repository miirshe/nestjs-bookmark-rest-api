/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { BookmarkDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('bookmark')
export class BookmarkController {
  constructor(
    private bookmarkService: BookmarkService,
  ) {}

  @Post('create')
  createBookmark(
    @GetUser('id') userId: string,
    @Body() dto: BookmarkDto,
  ) {
    return this.bookmarkService.createBookMark(
      userId,
      dto,
    );
  }

  @Patch(':id')
  editBookMark(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: BookmarkDto,
  ) {
    return this.bookmarkService.editBookMark(
      id,
      userId,
      dto,
    );
  }

  @Delete(':id')
  deleteBookMark(@Param('id') id: string) {
    return this.bookmarkService.deleteBookMark(
      id,
    );
  }

  @Get()
  getUserBookMarks(
    @GetUser('id') userId: string,
  ) {
    return this.bookmarkService.getUserBookMarks(
      userId,
    );
  }
}
