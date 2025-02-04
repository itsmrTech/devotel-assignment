import { Controller } from '@nestjs/common';
import { JobOfferService } from '../services/job-offer.service';

@Controller('api/job-offers')
export class JobOfferController {
    constructor(private readonly jobOffersService: JobOfferService) {}
}
