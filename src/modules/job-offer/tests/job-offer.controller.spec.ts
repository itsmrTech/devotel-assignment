import { Test, TestingModule } from '@nestjs/testing';
import { JobOfferController } from '../controllers/job-offer.controller';
import { JobOfferService } from '../services/job-offer.service';
import { HttpStatus } from '@nestjs/common';
import { GetJobOffersListReqDto } from '../dtos/job-offer.dto';
import { _jobOfferListItem } from './job-offer.mock';

describe('JobOfferController', () => {
    let controller: JobOfferController;
    let service: JobOfferService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [JobOfferController],
            providers: [
                {
                    provide: JobOfferService,
                    useValue: {
                        getJobOffersList: jest.fn().mockResolvedValue({
                            jobOffers: [
                                _jobOfferListItem,
                                _jobOfferListItem
                            ],
                            meta: {
                                total: 12,
                                pagesCount: 6,
                                page: 1,
                                pageSize: 2,
                            },
                        }),
                    },
                },
            ],
        }).compile();

        controller = module.get<JobOfferController>(JobOfferController);
        service = module.get<JobOfferService>(JobOfferService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call getJobOffersList() from service and return the response', async () => {
        const query: GetJobOffersListReqDto = {
            type: 'contract',
            salaryMin: 80000,
            salaryMax: 150000,
            salaryCurrency: 'USD',
            skills: ['python'],
            page: 1,
            pageSize: 2,
            locationSearch: 'New York',
            jobTitleSearch: 'Engineer',
            sortBy: 'salary',
            sortOrder: 'DESC',
        };

        const response = await controller.getJobOffersList(query);

        expect(service.getJobOffersList).toHaveBeenCalledWith({
            filters: {
                type: 'contract',
                salaryRange: [80000, 150000],
                salaryCurrency: 'USD',
                skills: ['python'],
            },
            pagination: {
                page: 1,
                pageSize: 2,
            },
            search: {
                location: 'New York',
                title: 'Engineer',
            },
            sort: {
                sortBy: 'salary',
                order: 'DESC',
            },
        });

        response.data.jobOffers.forEach((offer) => {
            expect(offer.type).toBe('contract');
            expect(offer.salaryMin).toBeGreaterThanOrEqual(80000);
            expect(offer.salaryMax).toBeLessThanOrEqual(150000);
            expect(offer.salaryCurrency).toBe('USD');
            expect(offer.skills).toContain('python');
            expect(offer.location).toContain('New York');
            expect(offer.title).toContain('Engineer');
        });
        expect(response.data.meta.page).toBe(1);
        expect(response.data.meta.pageSize).toBe(2);
    });
});
