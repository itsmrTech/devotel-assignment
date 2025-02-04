import { Test, TestingModule } from '@nestjs/testing';
import { JobOfferCronService } from '../services/job-offer.cron.service';
import { JobOfferInternalService } from '../services/job-offer.internal.service';

describe('JobOfferCronService', () => {
    let cron: JobOfferCronService;
    let service: JobOfferInternalService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JobOfferCronService,
                {
                    provide: JobOfferInternalService,
                    useValue: {
                    },
                },
            ],
        }).compile();

        cron = module.get<JobOfferCronService>(JobOfferCronService);
        service = module.get<JobOfferInternalService>(JobOfferInternalService);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });
});
