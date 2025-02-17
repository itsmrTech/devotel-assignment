import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from '../../../entities/job-offer.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
    IExcludeExistingJobOffersServiceInput,
    IExcludeExistingJobOffersServiceOutput,
    IFetchJobOffersAPIsServiceOutput,
    ISaveJobOffersServiceInput,
    ISaveJobOffersServiceOutput,
    ITransformAPI1ResponseServiceInput,
    ITransformAPI1ResponseServiceOutput,
    ITransformAPI2ResponseServiceInput,
    ITransformAPI2ResponseServiceOutput,
    ITransformAPIResponseServiceInput,
    ITransformAPIResponseServiceOutput,
} from '../interfaces/job-offer.service.interface';
import {
    convertCurrencySymbolToISO,
    parseMoneyStr,
} from '../../../utils/utils';
import { JobOfferProviderEnum } from '../../../enums/job-offer.entity.enum';

@Injectable()
export class JobOfferInternalService {
    private readonly logger = new Logger(JobOfferInternalService.name);
    private readonly apis: string[];

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(JobOffer)
        private readonly jobRepository: Repository<JobOffer>
    ) {
        this.apis = [
            this.configService.get<string>('EXTERNAL_API_URL_1'),
            this.configService.get<string>('EXTERNAL_API_URL_2'),
        ];
    }

    async fetchJobOffersFromAPIs(
 
    ): Promise<IFetchJobOffersAPIsServiceOutput> {
        this.logger.log('Fetching job offers from APIs...');
        const providers = [
            JobOfferProviderEnum.API1,
            JobOfferProviderEnum.API2,
        ];
        const responses: IFetchJobOffersAPIsServiceOutput['jobOffers'] = (
            await Promise.all(this.apis.map(async (api, index) => {
                return this.fetchAPI(api, providers[index], 0);
            }))
        ).filter((response) => response !== null);
        return { jobOffers: responses };
    }

    private async fetchAPI(
        api: string,
        provider: JobOfferProviderEnum,
        retry?: number
    ): Promise<{
        provider: JobOfferProviderEnum;
        url: string;
        data: object;
    }> {
        this.logger.log(`Fetching job offers from ${api}...`);
        try {
            // Handle the response
            const response = await axios.get(api);
            // Process the response if needed
            return {
                provider: provider ?? JobOfferProviderEnum.OTHER,
                url: api,
                data: response.data,
            };
        } catch (e) {
            this.logger.error(
                `Error fetching job offers from ${api}: ${e.message}`
            );
            if (
                retry &&
                retry < this.configService.get<number>('API_REQUEST_RETRIES')
            ) {
                return this.fetchAPI(api,provider,retry ?? 0 + 1);
            }

            return null;
        }
    }

    async transformAPIResponse(
        input: ITransformAPIResponseServiceInput
    ): Promise<ITransformAPIResponseServiceOutput> {
        this.logger.log(
            `Transforming API response from provider ${input.provider}...`
        );

        switch (input.provider) {
            case JobOfferProviderEnum.API1:
                return this.transformAPI1ResponseProvider1({
                    response:
                        input.data as ITransformAPI1ResponseServiceInput['response'],
                });
            case JobOfferProviderEnum.API2:
                return this.transformAPI2ResponseProvider2({
                    response:
                        input.data as ITransformAPI2ResponseServiceInput['response'],
                });
            default:
                return { jobOffers: [] };
        }
    }

    private async transformAPI1ResponseProvider1(
        input: ITransformAPI1ResponseServiceInput
    ): Promise<ITransformAPI1ResponseServiceOutput> {
        const jobOffers = input.response.jobs.map((job) => {
            const jobOffer = new JobOffer();
            jobOffer.externalId = job.jobId;
            jobOffer.title = job.title;
            jobOffer.company = job.company?.name;
            jobOffer.companyIndustry = job.company?.industry;
            jobOffer.location = job.details.location;
            jobOffer.type = job.details?.type?.trim()?.toLowerCase();
            const salaryRange = job.details?.salaryRange
                ?.split('-')
                ?.map((txt) => parseMoneyStr(txt));
            jobOffer.salaryMin = salaryRange?.[0]?.value;
            jobOffer.salaryMax = salaryRange?.[1]?.value;
            jobOffer.salaryCurrency = convertCurrencySymbolToISO(
                salaryRange?.[0]?.prefix
            );
            jobOffer.skills = job.skills
                ?.filter((skill) => !!skill)
                .map((skill) => skill.trim().toLowerCase())
                .filter((skill) => skill.length > 0);
            jobOffer.postedAt = new Date(job.postedDate);

            jobOffer.createdAt = new Date();
            jobOffer.updatedAt = new Date();
            jobOffer.provider = JobOfferProviderEnum.API1;
            return jobOffer;
        });
        return { jobOffers };
    }

    private async transformAPI2ResponseProvider2(
        input: ITransformAPI2ResponseServiceInput
    ): Promise<ITransformAPI2ResponseServiceOutput> {
        const jobOffers = Object.keys(input.response.data.jobsList).map(
            (jobId) => {
                const job = input.response.data.jobsList[jobId];
                const jobOffer = new JobOffer();
                jobOffer.externalId = jobId;
                jobOffer.title = job.position;
                jobOffer.company = job.employer?.companyName;
                jobOffer.companyWebsite = job.employer?.website;
                jobOffer.location = [job.location?.city, job.location?.state]
                    .filter((str) => !!str)
                    .join(', ');
                jobOffer.isRemote = job.location?.remote;
                jobOffer.salaryMin = job.compensation?.min;
                jobOffer.salaryMax = job.compensation?.max;
                jobOffer.salaryCurrency = convertCurrencySymbolToISO(
                    job.compensation?.currency
                );
                jobOffer.skills = job.requirements?.technologies;
                jobOffer.experienceRequiredInYears =
                    job.requirements?.experience;
                jobOffer.postedAt = new Date();

                jobOffer.createdAt = new Date();
                jobOffer.updatedAt = new Date();
                jobOffer.provider = JobOfferProviderEnum.API2;
                return jobOffer;
            }
        );
        return { jobOffers };
    }

    async excludeExistingJobOffers(
        input: IExcludeExistingJobOffersServiceInput
    ): Promise<IExcludeExistingJobOffersServiceOutput> {
        this.logger.log('Excluding existing job offers...');
        const existingJobOffers = await this.jobRepository.find({
            where: input.jobOffers.map((jobOffer) => ({
                externalId: jobOffer.externalId,
                provider: jobOffer.provider,
            })),
        });
        const newJobOffers = input.jobOffers.filter(
            (jobOffer) =>
                !existingJobOffers.some(
                    (existingJobOffer) =>
                        existingJobOffer.externalId === jobOffer.externalId &&
                        existingJobOffer.provider === jobOffer.provider
                )
        );
        return { newJobOffers, existingJobOffers };
    }

    async saveJobOffers(
        input: ISaveJobOffersServiceInput
    ): Promise<ISaveJobOffersServiceOutput> {
        this.logger.log('Saving job offers...');
        const jobOffers = await this.jobRepository.save(input.newJobOffers);
        for (const jobOffer of input.updateExistingJobOffers) {
            await this.jobRepository.update(
                {
                    externalId: jobOffer.externalId,
                    provider: jobOffer.provider,
                },
                jobOffer
            );
            const updatedJobOffer = await this.jobRepository.findOne({
                where: {
                    externalId: jobOffer.externalId,
                    provider: jobOffer.provider,
                },
            });
            jobOffers.push(updatedJobOffer);
        }
        return { jobOffers };
    }
}
