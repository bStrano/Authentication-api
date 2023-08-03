import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlatformEnum } from '../../../shared/constants/PlatformEnum';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsStrongPassword()
  password: string;
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty({ enum: PlatformEnum })
  @IsEnum(PlatformEnum)
  platform: PlatformEnum;
}
