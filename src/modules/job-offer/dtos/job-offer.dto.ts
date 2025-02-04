import { IsString, IsNumber, IsOptional, Min, IsNotEmpty, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetJobOffersListReqDto {
    @ApiPropertyOptional({
        description: 'Search by job title',
        required: false,
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    jobTitleSearch: string;

    @ApiPropertyOptional({ description: 'Search by location' })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    locationSearch: string;

    @ApiPropertyOptional({
        description: 'Minimum salary',
        minimum: 0,
        type: Number,
    })
    @IsNumber()
    @Min(0)
    @IsOptional()
    salaryMin: number;

    @ApiPropertyOptional({
        description: 'Maximum salary',
        minimum: 0,
        type: Number,
    })
    @IsNumber()
    @Min(0)
    @IsOptional()
    salaryMax: number;

    @ApiPropertyOptional({
        description: 'Job Offer Type',
        required: false,
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    type: string;

    @ApiPropertyOptional({
        description: 'Salary Currency',
        required: false,
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    salaryCurrency: string;

    @ApiPropertyOptional({
        description: 'Skills',
        required: false,
        type: [String],
    })
    @IsString({ each: true })
    @IsOptional()
    @IsNotEmpty({ each: true })
    @IsArray()
    skills: string[];

    @ApiPropertyOptional({
        description: 'Sort by',
        required: false,
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    sortBy: string;

    @ApiPropertyOptional({
        description: 'Sort order',
        required: false,
        enum: ['ASC', 'DESC'],
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(['ASC', 'DESC'])
    sortOrder: 'ASC' | 'DESC';

    @ApiProperty({ description: 'Page number', minimum: 1 })
    @IsNumber()
    @Min(1)
    page: number;

    @ApiProperty({ description: 'Page size', minimum: 1 })
    @IsNumber()
    @Min(1)
    pageSize: number;
}
