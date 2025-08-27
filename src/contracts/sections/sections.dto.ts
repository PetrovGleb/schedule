import { DayOfWeek } from '@prisma/client';
import { ErrorDto, SuccessDto } from '../common/common.dto';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsString,
  Matches,
} from 'class-validator';

export class SectionItemDto {
  sectionId!: number;
  subjectName!: string;
  startTime!: string;
  endTime!: string;
  duration!: number;
  classroom!: string;
  teacher!: string;
  daysOfWeek!: DayOfWeek[];
}

export class GetSectionsOkDto extends SuccessDto {
  constructor(public result: SectionItemDto[]) {
    super();
  }
}

export type GetSectionsResponseDto = GetSectionsOkDto | ErrorDto;

export class AddNewSectionDto extends SuccessDto {
  @IsInt()
  subjectId: number;

  @IsInt()
  classroomId: number;

  @IsString()
  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    message: 'startTime must be in HH:MM format',
  })
  startTime: string;

  @IsInt()
  @IsIn([50, 80])
  duration: number;

  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  daysOfWeek: DayOfWeek[];
}

export class AddNewSectionResponseSuccessDto extends SuccessDto {
  constructor(public result: SectionItemDto) {
    super();
  }
}

export type AddNewSectionResponseDto =
  | AddNewSectionResponseSuccessDto
  | ErrorDto;
