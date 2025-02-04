import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { JobOffer } from 'src/entities/job-offer.entity';
import { JobOfferService } from './services/job-offer.service';
import { JobOfferInternalService } from './services/job-offer.internal.service';
import { JobOfferCronService } from './services/job-offer.cron.service';
import { JobOfferController } from './controllers/job-offer.controller';

@Module({
    imports: [TypeOrmModule.forFeature([JobOffer]), ScheduleModule.forRoot()],
    providers: [JobOfferService, JobOfferInternalService, JobOfferCronService],
    controllers: [JobOfferController],
})
export class JobOffersModule {}
