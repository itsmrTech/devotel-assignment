import { Injectable, Logger } from '@nestjs/common';
import { JobOfferInternalService } from './job-offer.internal.service';
import { Cron } from '@nestjs/schedule';
import { ISyncJobOffersCronServiceOutput } from '../interfaces/job-offer.service.interface';
import { JobOffer } from '../../../entities/job-offer.entity';
@Injectable()
export class JobOfferCronService {
    private readonly logger = new Logger(JobOfferCronService.name);

    constructor(
        private readonly jobOfferInternalService: JobOfferInternalService
    ) {
        this.syncJobOffersCron()
            .then((result) => {
                this.logger.log(
                    `Initial sync of job offers completed: ${result.jobOffers.length} job offers synced`
                );
            })
            .catch((e) => {
                this.logger.error(`Error syncing job offers: ${e.message}`);
            });
    }

    @Cron(process.env['CRON_JOB_OFFER_SCHEDULE'] as string)
    async syncJobOffersCron(): Promise<ISyncJobOffersCronServiceOutput> {
        try {
            this.logger.log('Syncing job offers...');
            const fetchResult =
                await this.jobOfferInternalService.fetchJobOffersFromAPIs();
            const jobOfferObjs: JobOffer[] = [];
            for (const jobOffer of fetchResult.jobOffers) {
                const { jobOffers } =
                    await this.jobOfferInternalService.transformAPIResponse({
                        provider: jobOffer.provider,
                        data: jobOffer.data,
                    });
                jobOfferObjs.push(...jobOffers);
            }
            const seperatedJobOffers =
                await this.jobOfferInternalService.excludeExistingJobOffers({
                    jobOffers: jobOfferObjs,
                });
            const saveResult = await this.jobOfferInternalService.saveJobOffers(
                {
                    newJobOffers: seperatedJobOffers.newJobOffers,
                    updateExistingJobOffers: seperatedJobOffers.existingJobOffers,
                }
            );
            return { jobOffers: saveResult.jobOffers };
        } catch (e) {
            this.logger.error(`Error syncing job offers: ${e.message}`);
            return { jobOffers: [] };
        }
    }
}
