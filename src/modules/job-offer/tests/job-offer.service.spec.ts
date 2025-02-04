import { JobOffer } from '../../../entities/job-offer.entity';
import { Repository } from 'typeorm';
import { JobOfferService } from '../services/job-offer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { _jobOfferListItem } from './job-offer.mock';

describe('JobOfferService', () => {
    let service: JobOfferService;
    let repository: Repository<JobOffer>;

    beforeEach(async () => {
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
        repository = module.get<Repository<JobOffer>>(getRepositoryToken(JobOffer));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getJobOffersList', () => {
        let findMock: jest.SpyInstance;
        let countMock: jest.SpyInstance;

        beforeEach(() => {
            findMock = jest.spyOn(repository, 'find').mockResolvedValue([
                _jobOfferListItem as JobOffer,
            ]);

            countMock = jest.spyOn(repository, 'count').mockResolvedValue(1);
        });

        it('should throw an error if salary currency is missing when salary range is provided', async () => {
            const input = {
                filters: {
                    salaryRange: [50000, 100000] as [number, number],
                    salaryCurrency: null, // Missing salary currency
                    type: 'Full-time',
                    skills: ['React'],
                },
                search: {
                    title: '',
                    location: '',
                },
                sort: {
                    sortBy: 'title',
                    order: 'ASC' as 'ASC' | 'DESC',
                },
                pagination: {
                    page: 1,
                    pageSize: 10,
                },
            };

            await expect(service.getJobOffersList(input)).rejects.toThrow(
                new HttpException('Salary currency is required', HttpStatus.BAD_REQUEST)
            );
        });

        it('should return job offers with applied filters', async () => {
            const input = {
                filters: {
                    salaryRange: [50000, 100000] as [number, number],
                    salaryCurrency: 'USD',
                    type: 'Full-time',
                    skills: ['React', 'Node.js'],
                },
                search: {
                    title: 'Software Engineer',
                    location: 'New York',
                },
                sort: {
                    sortBy: 'title',
                    order: 'ASC' as 'ASC' | 'DESC',
                },
                pagination: {
                    page: 1,
                    pageSize: 10,
                },
            };

            const result = await service.getJobOffersList(input);

            expect(findMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        type: 'Full-time',
                        location: expect.anything(),
                        title: expect.anything(),
                        salaryMin: expect.anything(),
                        salaryMax: expect.anything(),
                        salaryCurrency: 'USD',
                        skills: expect.anything(),
                    }),
                    order: { title: 'ASC' },
                    take: 10,
                    skip: 0,
                })
            );

            expect(countMock).toHaveBeenCalled();
            expect(result).toEqual({
                jobOffers: expect.any(Array),
                meta: {
                    total: 1,
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                },
            });
        });

        it('should handle pagination correctly', async () => {
            const input = {
                filters: {
                    salaryRange: [50000, 100000] as [number, number],
                    salaryCurrency: 'USD',
                    type: 'Full-time',
                    skills: ['React'],
                },
                search: {
                    title: '',
                    location: '',
                },
                sort: {
                    sortBy: 'title',
                    order: 'ASC' as 'ASC' | 'DESC',
                },
                pagination: {
                    page: 2,
                    pageSize: 5,
                },
            };

            await service.getJobOffersList(input);

            expect(findMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    take: 5,
                    skip: 5, // (2 - 1) * 5 = 5
                })
            );
        });

        it('should return empty jobOffers array if no jobs match the criteria', async () => {
            findMock.mockResolvedValueOnce([]);
            countMock.mockResolvedValueOnce(0);

            const input = {
                filters: {
                    salaryRange: [100000, 200000] as [number, number], 
                    salaryCurrency: 'USD',
                    type: 'Part-time',
                    skills: ['Rust'],
                },
                search: {
                    title: '',
                    location: '',
                },
                sort: {
                    sortBy: 'title',
                    order: 'ASC' as 'ASC' | 'DESC',
                },
                pagination: {
                    page: 1,
                    pageSize: 10,
                },
            };

            const result = await service.getJobOffersList(input);

            expect(result).toEqual({
                jobOffers: [],
                meta: {
                    total: 0,
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                },
            });
        });
    });
});
