import * as dotenv from 'dotenv-safe';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, 
            forbidNonWhitelisted: true, 
            transform: true, 
        })
    );
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
