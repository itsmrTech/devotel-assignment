import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    Any,
    ILike,
    In,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
    Raw,
    Repository,
} from 'typeorm';
import { JobOffer } from '../../../entities/job-offer.entity';
import {
    IGetJobOffersListServiceInput,
    IGetJobOffersListServiceOutput,
} from '../interfaces/job-offer.service.interface';

@Injectable()
export class JobOfferService {
    private readonly logger = new Logger(JobOfferService.name);

    constructor(
        @InjectRepository(JobOffer)
        private readonly jobRepository: Repository<JobOffer>
    ) {}

    async getJobOffersList(
        input: IGetJobOffersListServiceInput
    ): Promise<IGetJobOffersListServiceOutput> {
        this.logger.log('Getting job offers list...');
        const minSalary = input.filters.salaryRange[0];
        const maxSalary = input.filters.salaryRange[1];
        if (!input.filters.salaryCurrency && (minSalary || maxSalary))
            throw new HttpException(
                'Salary currency is required',
                HttpStatus.BAD_REQUEST
            );
        const query = {
            type: input.filters.type,
            location: input.search.location
                ? ILike(`%${input.search.location}%`)
                : undefined,
            title: input.search.title
                ? ILike(`%${input.search.title}%`)
                : undefined,
            salaryMin: minSalary ? MoreThanOrEqual(minSalary) : undefined,
            salaryMax: maxSalary ? LessThanOrEqual(maxSalary) : undefined,
            salaryCurrency: input.filters.salaryCurrency?.toUpperCase(),
            skills: input.filters.skills
                ? Raw(
                    (alias) => `string_to_array(${alias}, ',') && ARRAY[:...skills]`,
                    { skills: input.filters.skills }
                  )
                : undefined,
        };
        const jobOffers = await this.jobRepository.find({
            where: query,
            order: {
                [input.sort.sortBy]: input.sort.order,
            },
            take: input.pagination.pageSize,
            skip: (input.pagination.page - 1) * input.pagination.pageSize,
        });
        const total = await this.jobRepository.count({ where: query });

        return {
            jobOffers,
            meta: {
                total,
                pagesCount: Math.ceil(total / input.pagination.pageSize),
                page: input.pagination.page,
                pageSize: input.pagination.pageSize,
            },
        };
    }
}
