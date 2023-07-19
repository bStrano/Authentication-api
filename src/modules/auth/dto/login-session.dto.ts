import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginSessionDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
