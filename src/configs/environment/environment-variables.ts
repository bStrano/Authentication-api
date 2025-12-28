import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { Environment } from './environment.enum';
import { plainToInstance } from 'class-transformer';

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
  FINANCIAL_JWT_EXPIRATION_TIME: number;
  @IsNumber()
  KEYCHAIN_JWT_EXPIRATION_TIME: number;
  @IsNumber()
  LIFE_GAMIFICATION_JWT_EXPIRATION_TIME: number;
  @IsNumber()
  FINANCIAL_JWT_REFRESH_EXPIRATION_TIME: number;
  @IsNumber()
  KEYCHAIN_JWT_REFRESH_EXPIRATION_TIME: number;
  @IsNumber()
  LIFE_GAMIFICATION_JWT_REFRESH_EXPIRATION_TIME: number;
  @IsString()
  FINANCIAL_JWT_SECRET: string;
  @IsString()
  KEYCHAIN_JWT_SECRET: string;
  @IsString()
  LIFE_GAMIFICATION_JWT_SECRET: string;
  @IsString()
  FINANCIAL_JWT_REFRESH_SECRET: string;
  @IsString()
  KEYCHAIN_JWT_REFRESH_SECRET: string;
  @IsString()
  LIFE_GAMIFICATION_JWT_REFRESH_SECRET: string;

  // Google OAuth - Financial (opcional)
  @IsOptional()
  @IsString()
  FINANCIAL_GOOGLE_CLIENT_ID?: string;
  @IsOptional()
  @IsString()
  FINANCIAL_GOOGLE_CLIENT_SECRET?: string;
  @IsOptional()
  @IsString()
  FINANCIAL_GOOGLE_CALLBACK_URL?: string;
  @IsOptional()
  @IsString()
  FINANCIAL_FRONTEND_URL?: string;

  // Google OAuth - Keychain (opcional)
  @IsOptional()
  @IsString()
  KEYCHAIN_GOOGLE_CLIENT_ID?: string;
  @IsOptional()
  @IsString()
  KEYCHAIN_GOOGLE_CLIENT_SECRET?: string;
  @IsOptional()
  @IsString()
  KEYCHAIN_GOOGLE_CALLBACK_URL?: string;
  @IsOptional()
  @IsString()
  KEYCHAIN_FRONTEND_URL?: string;

  // Google OAuth - Life Gamification (opcional)
  @IsOptional()
  @IsString()
  LIFE_GAMIFICATION_GOOGLE_CLIENT_ID?: string;
  @IsOptional()
  @IsString()
  LIFE_GAMIFICATION_GOOGLE_CLIENT_SECRET?: string;
  @IsOptional()
  @IsString()
  LIFE_GAMIFICATION_GOOGLE_CALLBACK_URL?: string;
  @IsOptional()
  @IsString()
  LIFE_GAMIFICATION_FRONTEND_URL?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
