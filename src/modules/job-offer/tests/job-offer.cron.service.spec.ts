import { Test, TestingModule } from '@nestjs/testing';
import { JobOfferCronService } from '../services/job-offer.cron.service';
import { JobOfferInternalService } from '../services/job-offer.internal.service';
import { Logger } from '@nestjs/common';
import {
    ITransformAPIResponseServiceInput,
    ITransformAPIResponseServiceOutput,
} from '../interfaces/job-offer.service.interface';
import {
    _fetchResponse,
    _jobOffersAPI1Entity,
    _jobOffersAPI2Entity,
} from './job-offer.mock';
import { JobOfferProviderEnum } from '../../../enums/job-offer.entity.enum';

describe('JobOfferCronService', () => {
    let cronService: JobOfferCronService;
    let internalService: JobOfferInternalService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JobOfferCronService,
                {
                    provide: JobOfferInternalService,
                    useValue: {
                        fetchJobOffersFromAPIs: jest.fn().mockResolvedValue({
                            jobOffers: _fetchResponse,
                        }),
                        transformAPIResponse: jest
                            .fn()
                            .mockImplementation(
                                (
                                    input: ITransformAPIResponseServiceInput
                                ): ITransformAPIResponseServiceOutput => {
                                    return input.provider ===
                                        JobOfferProviderEnum.API1
                                        ? {
                                            jobOffers: _jobOffersAPI1Entity,
                                        }
                                        : {
                                            jobOffers: _jobOffersAPI2Entity,
                                        };
                                }
                            ),
                        saveJobOffers: jest.fn().mockResolvedValue({
                            jobOffers: [
                                ..._jobOffersAPI1Entity,
                                ..._jobOffersAPI2Entity,
                            ],
                        }),
                    },
                },
                {
                    provide: Logger,
                    useValue: {
                        log: jest.fn(),
                        error: jest.fn(),
                    },
                },
            ],
        }).compile();

        cronService = module.get<JobOfferCronService>(JobOfferCronService);
        internalService = module.get<JobOfferInternalService>(
            JobOfferInternalService
        );
    });

    it('should be defined', () => {
        expect(cronService).toBeDefined();
    });

    it('should fetch, transform, and save job offers on cron execution', async () => {
        const result = await cronService.syncJobOffersCron();

        expect(internalService.fetchJobOffersFromAPIs).toHaveBeenCalled();
        expect(internalService.transformAPIResponse).toHaveBeenCalledTimes(2);
        expect(internalService.saveJobOffers).toHaveBeenCalled();
        expect(result.jobOffers.length).toBe(2);
    });

});
