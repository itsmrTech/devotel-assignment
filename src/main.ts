import * as dotenv from 'dotenv-safe';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Devotel Assignment API')
        .setContact(
            'Mohammad Tahvildary',
            'https://itsmrtech.com',
            'mohammad.tahvildary@gmail.com'
        )
        .build();
    const document = SwaggerModule.createDocument(app, config, {});
    SwaggerModule.setup('docs', app, document);
    await app.listen(3000);
}
bootstrap();
