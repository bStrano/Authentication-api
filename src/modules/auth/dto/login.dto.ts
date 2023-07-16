import {IsEnum, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {PlatformEnum} from "../../../shared/constants/PlatformEnum";

export class LoginDto {
    @ApiProperty()
    @IsString()
    email: string;
    @ApiProperty()
    @IsString()
    password: string;
    @ApiProperty()
    @IsEnum(PlatformEnum)
    platform: PlatformEnum
}
