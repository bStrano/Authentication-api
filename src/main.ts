import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { initializeSwagger } from './configs/swagger/initializeSwagger';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use Winston logger
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  // Security: Apply Helmet middleware for API security headers
  app.use(helmet({
    // Disable CSP since this is an API, not a web app rendering HTML
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    // Keep these security headers that are useful for APIs:
    // - X-DNS-Prefetch-Control
    // - X-Frame-Options
    // - X-Content-Type-Options
    // - Strict-Transport-Security
    // - X-Download-Options
    // - X-Permitted-Cross-Domain-Policies
  }));

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

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  logger.log(`🚀 Application started at port ${port}`);
}
bootstrap();
