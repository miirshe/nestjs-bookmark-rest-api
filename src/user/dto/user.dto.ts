/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;
}
