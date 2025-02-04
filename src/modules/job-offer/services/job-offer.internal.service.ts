import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from '../../../entities/job-offer.entity';

@Injectable()
export class JobOfferInternalService {
    private readonly logger = new Logger(JobOfferInternalService.name);

    constructor(
        @InjectRepository(JobOffer)
        private readonly jobRepository: Repository<JobOffer>
    ) {}
}
