import { Test, TestingModule } from '@nestjs/testing';
import { JobOfferController } from '../controllers/job-offer.controller';
import { JobOfferService } from '../services/job-offer.service';

describe('JobOfferController', () => {
    let controller: JobOfferController;
    let service: JobOfferService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [JobOfferController],
            providers: [
                {
                    provide: JobOfferService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<JobOfferController>(JobOfferController);
        service = module.get<JobOfferService>(JobOfferService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
