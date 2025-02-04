import { JobOfferProviderEnum } from '../enums/job-offer.entity.enum';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import {
    IsInt,
    IsString,
    IsBoolean,
    IsOptional,
    IsUrl,
    IsEnum,
    IsDate,
    IsArray,
    Min,
    IsNotEmpty,
} from 'class-validator';

@Entity()
@Unique(['externalId', 'provider'])
export class JobOffer {
    @PrimaryGeneratedColumn({ type: 'int' })
    @IsInt()
    id: number;

    @Column({ type: 'varchar' })
    @IsString()
    title: string;

    @Column({ type: 'varchar' })
    @IsString()
    company: string;

    @Column({ type: 'varchar', nullable: true })
    @IsUrl()
    @IsOptional()
    companyWebsite?: string;

    @Column({ type: 'varchar', nullable: true })
    @IsString()
    @IsOptional()
    companyIndustry?: string;

    @Column({ type: 'varchar' })
    @IsString()
    location: string;

    @Column({ type: 'boolean', nullable: true })
    @IsBoolean()
    @IsOptional()
    isRemote?: boolean;

    @Column({ type: 'int', nullable: true })
    @IsInt()
    @Min(0)
    @IsOptional()
    experienceRequiredInYears?: number;

    @Column({ type: 'float', nullable: true })
    @IsOptional()
    @IsString()
    @Min(0)
    salaryMin?: number;

    @Column({ type: 'float', nullable: true })
    @IsOptional()
    @IsString()
    @Min(0)
    salaryMax?: number;

    @Column({
        type: 'varchar',
        default: 'USD',
    })
    @IsString()
    salaryCurrency: string;

    @Column('simple-array', { nullable: true })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    skills?: string[];

    // This value could be defined as an enum, but as we don't know all the possible values, we'll keep it as a string
    @Column({ type: 'varchar', default: 'unknown' })
    @IsString()
    type: string;

    @Column({ type: 'varchar' })
    @IsString()
    externalId: string;

    @Column({
        type: 'enum',
        enum: JobOfferProviderEnum,
        default: JobOfferProviderEnum.OTHER,
    })
    @IsEnum(JobOfferProviderEnum)
    provider: JobOfferProviderEnum;

    @Column({ type: 'timestamp' })
    @IsDate()
    postedAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @IsDate()
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @IsDate()
    updatedAt: Date;
}
