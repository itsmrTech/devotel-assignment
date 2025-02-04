import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { _jobOfferListItem } from '../src/modules/job-offer/tests/job-offer.mock';
import { AppModule } from '../src/app.module';
import { JobOfferService } from '../src/modules/job-offer/services/job-offer.service';

describe('JobOfferController (e2e)', () => {
    let app: INestApplication;
    let jobOfferService: JobOfferService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(JobOfferService)
            .useValue({
                getJobOffersList: jest.fn().mockResolvedValue({
                    jobOffers: [
                        _jobOfferListItem
                    ],
                    meta: {
                        total: 12,
                        pagesCount: 6,
                        page: 1,
                        pageSize: 1,
                    },
                }),
            })
            .compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
                transformOptions: { enableImplicitConversion: true },
            })
        );

        await app.init();
        jobOfferService = moduleFixture.get<JobOfferService>(JobOfferService);
    });

    afterAll(async () => {
        await app.close();
    });

    it('should return job offers (GET /api/job-offers)', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/job-offers')
            .query({
                page: 1,
                pageSize: 1,
                sortBy: 'salaryMin',
                sortOrder: 'DESC',
            })
            .expect(HttpStatus.OK);

        expect(response.body.code).toEqual(HttpStatus.OK);

        expect(jobOfferService.getJobOffersList).toHaveBeenCalled();
    });

    it('should return 400 for invalid query params (GET /api/job-offers)', async () => {
        await request(app.getHttpServer())
            .get('/api/job-offers?page=invalid')
            .expect(HttpStatus.BAD_REQUEST);
    });
});
