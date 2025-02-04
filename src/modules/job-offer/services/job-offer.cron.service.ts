import { Injectable } from '@nestjs/common';
import { JobOfferInternalService } from './job-offer.internal.service';

@Injectable()
export class JobOfferCronService {
    constructor(
        private readonly jobOfferInternalService: JobOfferInternalService
    ) {}
}
