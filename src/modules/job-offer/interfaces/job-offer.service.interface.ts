import { JobOffer } from 'src/entities/job-offer.entity';
import { JobOfferProviderEnum } from 'src/enums/job-offer.entity.enum';

export interface IFetchJobOffersAPIsServiceOutput {
    jobOffers: {
        provider: JobOfferProviderEnum;
        url: string;
        data: object;
    }[];
}

export interface ITransformAPIResponseServiceInput {
    provider: JobOfferProviderEnum;
    data: object;
}

export interface ITransformAPIResponseServiceOutput {
    jobOffers: JobOffer[];
}

export interface ITransformAPI1ResponseServiceInput {
    response: {
        metadata: {
            requestId: string;
            timestamp: string;
        };
        jobs: {
            jobId: string;
            title: string;
            details: {
                location: string;
                type: string;
                salaryRange: string;
            };
            company: {
                name: string;
                industry: string;
            };
            skills: string[];
            postedDate: string;
        }[];
    };
}
export interface ITransformAPI1ResponseServiceOutput {
    jobOffers: JobOffer[];
}

export interface ITransformAPI2ResponseServiceInput {
    response: {
        status: string;
        data: {
            jobsList: {
                [key: string]: {
                    position: string;
                    location: {
                        city: string;
                        state: string;
                        remote: boolean;
                    };
                    compensation: {
                        min: number;
                        max: number;
                        currency: string;
                    };
                    employer: {
                        companyName: string;
                        website: string;
                    };
                    requirements: {
                        experience: number;
                        technologies: string[];
                    };
                    datePosted: string;
                };
            };
        };
    };
}
export interface ITransformAPI2ResponseServiceOutput {
    jobOffers: JobOffer[];
}

export interface ISaveJobOffersServiceInput {
    jobOffers: JobOffer[];
}
export interface ISaveJobOffersServiceOutput {
    jobOffers: JobOffer[];
}

export interface ISyncJobOffersCronServiceOutput {
    jobOffers: JobOffer[];
}