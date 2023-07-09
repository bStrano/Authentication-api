import {NestFactory} from '@nestjs/core';
import {AppModule} from "./modules/app.module";
import {ConfigService} from "@nestjs/config";
import {Logger} from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  await app.listen(5000 || port);
  logger.log(`🚀 Application started at port ${5000 || port}`)
}
bootstrap();
