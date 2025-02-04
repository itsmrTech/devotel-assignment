import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { JobOfferService } from '../services/job-offer.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { GetJobOffersListReqDto } from '../dtos/job-offer.dto';

@ApiTags('Job Offers')
@Controller('api/job-offers')
export class JobOfferController {
    constructor(private readonly jobOffersService: JobOfferService) {}

    @ApiOperation({ summary: 'Get job offers list' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Job offers list fetched successfully',
        schema: {
            example: {
                code: 200,
                message: 'Job offers list fetched successfully',
                data: {
                    jobOffers: [
                        {
                            id: 282,
                            title: 'Backend Engineer',
                            company: 'DataWorks',
                            companyWebsite: null,
                            companyIndustry: 'Design',
                            location: 'New York, NY',
                            isRemote: null,
                            experienceRequiredInYears: null,
                            salaryMin: 89000,
                            salaryMax: 148000,
                            salaryCurrency: 'USD',
                            skills: ['python', 'machine learning', 'sql'],
                            type: 'contract',
                            externalId: 'P1-543',
                            provider: 'provider1',
                            postedAt: '2025-01-30T15:23:47.331Z',
                            createdAt: '2025-02-04T22:05:13.512Z',
                            updatedAt: '2025-02-04T22:05:13.512Z',
                        },
                        {
                            id: 283,
                            title: 'Data Scientist',
                            company: 'DataWorks',
                            companyWebsite: null,
                            companyIndustry: 'Technology',
                            location: 'Austin, TX',
                            isRemote: null,
                            experienceRequiredInYears: null,
                            salaryMin: 87000,
                            salaryMax: 147000,
                            salaryCurrency: 'USD',
                            skills: ['python', 'machine learning', 'sql'],
                            type: 'full-time',
                            externalId: 'P1-291',
                            provider: 'provider1',
                            postedAt: '2025-01-28T21:03:22.123Z',
                            createdAt: '2025-02-04T22:05:13.512Z',
                            updatedAt: '2025-02-04T22:05:13.512Z',
                        },
                    ],
                    meta: {
                        total: 12,
                        pagesCount: 6,
                        page: 1,
                        pageSize: 2,
                    },
                },
            },
        },
    })
    @Get()
    async getJobOffersList(@Query() query: GetJobOffersListReqDto) {
        const result = await this.jobOffersService.getJobOffersList({
            filters: {
                type: query.type,
                salaryRange: [
                    query.salaryMin ? Number(query.salaryMin) : null,
                    query.salaryMax ? Number(query.salaryMax) : null,
                ],
                salaryCurrency: query.salaryCurrency,
                skills:
                    typeof query.skills === 'string'
                        ? [query.skills]
                        : query.skills,
            },
            pagination: {
                page: Number(query.page),
                pageSize: Number(query.pageSize),
            },
            search: {
                location: query.locationSearch,
                title: query.jobTitleSearch,
            },
            sort: {
                sortBy: query.sortBy,
                order: query.sortOrder,
            },
        });

        return {
            code: HttpStatus.OK,
            message: 'Job offers list fetched successfully',
            data: result,
        };
    }
}
