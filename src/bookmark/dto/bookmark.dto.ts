/* eslint-disable prettier/prettier */

import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class BookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  link: string;
}
