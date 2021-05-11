declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENVIRONMENT: 'DEVELOPMENT' | 'PRODUCTION';
      PORT?: string;
      DB_HOST: string;
      DB_POST: string;
      DB_USER: string;
      DB_PASS: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      ENCRYPTION_KEY: string
    }
  }
}
export {}
