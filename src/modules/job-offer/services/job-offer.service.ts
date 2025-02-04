import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from '../../../entities/job-offer.entity';

@Injectable()
export class JobOfferService {
    private readonly logger = new Logger(JobOfferService.name);

    constructor(
        @InjectRepository(JobOffer)
        private readonly jobRepository: Repository<JobOffer>
    ) {}
}
