import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

export function initializeSwagger(app) {
    const config = new DocumentBuilder()
        .setTitle('Stralom Authentication')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
}
