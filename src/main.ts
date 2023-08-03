import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { initializeSwagger } from './configs/swagger/initializeSwagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [/.*\.stralom\.com$/],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    },
  });
  initializeSwagger(app);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3002;
  const NODE_ENV = configService.get('NODE_ENV');
  if (NODE_ENV === 'local') {
    app.enableCors();
  } else {
    app.enableCors({
      origin: [/.*\.stralom\.com$/],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    });
  }

  await app.listen(port);
  logger.log(`🚀 Application started at port ${port}`);
}
bootstrap();
