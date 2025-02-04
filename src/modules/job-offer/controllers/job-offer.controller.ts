import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { JobOfferService } from '../services/job-offer.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetJobOffersListReqDto } from '../dtos/job-offer.dto';

@ApiTags('Job Offers')
@Controller('api/job-offers')
export class JobOfferController {
    constructor(private readonly jobOffersService: JobOfferService) {}

    @ApiOperation({ summary: 'Get job offers list' })
    @Get()
    async getJobOffersList(
        @Query() query: GetJobOffersListReqDto
    ) {
        const result = await this.jobOffersService.getJobOffersList({
            filters: {
                type: query.type,
                salaryRange: [
                    query.salaryMin ? Number(query.salaryMin) : null,
                    query.salaryMax ? Number(query.salaryMax) : null,
                ],
                salaryCurrency: query.salaryCurrency,
                skills: typeof query.skills === 'string' ? [query.skills] : query.skills,
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
