import { IsInt, Min } from 'class-validator';
import { StreamableFile } from '@nestjs/common';
import { ErrorDto, SuccessDto } from '../common/common.dto';
import { Type } from 'class-transformer';

export class AddSectionToScheduleParamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  sectionId!: number;
}

export type AddSectionToScheduleResponseDto = SuccessDto | ErrorDto;

export class RemoveSectionFromScheduleParamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  sectionId!: number;
}

export type RemoveSectionFromScheduleResponseDto = SuccessDto | ErrorDto;

export class GetScheduleParamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId!: number;
}

export type GetScheduleResponseDto = StreamableFile | ErrorDto;
