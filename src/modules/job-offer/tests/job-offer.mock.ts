import { JobOfferProviderEnum } from '../../../enums/job-offer.entity.enum';

export const _jobOffersAPI1Entity = [
    {
        externalId: '123',
        title: 'Software Engineer',
        company: 'Creative Design Ltd',
        createdAt: new Date(),
        id: 1,
        location: 'Seattle, WA',
        postedAt: new Date(),
        provider: JobOfferProviderEnum.API1,
        salaryCurrency: 'USD',
        type: 'contract',
        updatedAt: new Date(),
        companyIndustry: 'Design',
        salaryMax: 123000,
        salaryMin: 77000,
        skills: ['html', 'css', 'vue.js'],
    },
];
export const _jobOffersAPI2Entity = [
    {
        externalId: '456',
        title: 'Frontend Developer',
        company: 'BackEnd Solutions',
        createdAt: new Date(),
        id: 2,
        location: 'Austin, NY',
        postedAt: new Date(),
        provider: JobOfferProviderEnum.API2,
        salaryCurrency: 'USD',
        type: 'full-time',
        updatedAt: new Date(),
        companyIndustry: 'Software',
        salaryMax: 86000,
        salaryMin: 70000,
        skills: ['javascript', 'node.js', 'react'],
        isRemote: false,
        companyWebsite: 'https://backendsolutions.com',
        experienceRequiredInYears: 4,
    },
];

export const _fetchResponse = [
    {
        provider: 1,
        data: {
            metadata: {
                requestId: 'req-s7liimwgg',
                timestamp: '2025-02-04T11:13:17.122Z',
            },
            jobs: [
                {
                    jobId: 'P1-645',
                    title: 'Software Engineer',
                    details: {
                        location: 'Seattle, WA',
                        type: 'Contract',
                        salaryRange: '$77k - $123k',
                    },
                    company: {
                        name: 'Creative Design Ltd',
                        industry: 'Design',
                    },
                    skills: ['HTML', 'CSS', 'Vue.js'],
                    postedDate: '2025-01-27T07:41:30.279Z',
                },
                {
                    jobId: 'P1-572',
                    title: 'Data Scientist',
                    details: {
                        location: 'New York, NY',
                        type: 'Contract',
                        salaryRange: '$62k - $139k',
                    },
                    company: {
                        name: 'BackEnd Solutions',
                        industry: 'Solutions',
                    },
                    skills: ['HTML', 'CSS', 'Vue.js'],
                    postedDate: '2025-01-29T02:35:18.129Z',
                },
            ],
        },
    },
];

export const _jobOfferListItem = {
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
    postedAt: new Date('2025-01-30T15:23:47.331Z'),
    createdAt: new Date('2025-02-04T22:05:13.512Z'),
    updatedAt: new Date('2025-02-04T22:05:13.512Z'),
};
