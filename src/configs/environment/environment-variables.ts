import {IsEnum, IsNumber, IsString, validateSync} from "class-validator";
import {Environment} from "./environment.enum";
import {plainToInstance} from "class-transformer";

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;
    @IsNumber()
    PORT: number;
    @IsString()
    DB_HOST: string;
    @IsNumber()
    DB_PORT: number;
    @IsString()
    DB_USERNAME: string;
    @IsString()
    DB_PASSWORD: string;
    @IsString()
    DB_DATABASE: string;
    @IsNumber()
    FINANCIAL_JWT_EXPIRATION_TIME: number
    @IsNumber()
    KEYCHAIN_JWT_EXPIRATION_TIME: number
    @IsNumber()
    FINANCIAL_JWT_REFRESH_EXPIRATION_TIME: number
    @IsNumber()
    KEYCHAIN_JWT_REFRESH_EXPIRATION_TIME: number
    @IsString()
    FINANCIAL_JWT_SECRET: string
    @IsString()
    KEYCHAIN_JWT_SECRET: string
    @IsString()
    FINANCIAL_JWT_REFRESH_SECRET: string
    @IsString()
    KEYCHAIN_JWT_REFRESH_SECRET: string

}



export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(
        EnvironmentVariables,
        config,
        { enableImplicitConversion: true },
    );
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
