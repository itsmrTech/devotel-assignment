import { JobOffer } from '../../../entities/job-offer.entity';
import { Repository } from 'typeorm';
import { JobOfferService } from '../services/job-offer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

describe('JobOfferService', () => {
    let service: JobOfferService;
    let repository: Repository<JobOffer>;
    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JobOfferService,
                {
                    provide: getRepositoryToken(JobOffer),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<JobOfferService>(JobOfferService);
        repository = module.get<Repository<JobOffer>>(
            getRepositoryToken(JobOffer)
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
