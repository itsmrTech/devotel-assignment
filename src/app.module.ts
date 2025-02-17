import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { JobOffer } from './entities/job-offer.entity';
import { JobOfferModule } from './modules/job-offer/job-offer.module';
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                DATABASE_URL: Joi.string().uri().required(),
                EXTERNAL_API_URL_1: Joi.string().uri().required(),
                EXTERNAL_API_URL_2: Joi.string().uri().required(),
                CRON_JOB_OFFER_SCHEDULE: Joi.string().required(),
                API_REQUEST_RETRIES: Joi.number().required(),
            }),
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [JobOffer],
            synchronize: true,
        }),
        JobOfferModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
