import { Body, Controller, Get, Post } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { ISectionsController } from '../../contracts/sections/sections.api.interface';
import { ScheduleError } from '../../utils/schedule-error';
import {
  AddNewSectionDto,
  AddNewSectionResponseDto,
  GetSectionsResponseDto,
} from '../../contracts/sections/sections.dto';

@Controller('sections')
export class SectionsController implements ISectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get()
  async getAllSections(): Promise<GetSectionsResponseDto> {
    try {
      const sections = await this.sectionsService.getAllSections();
      return {
        success: true,
        result: sections,
      };
    } catch (error) {
      return {
        success: false,
        error: ScheduleError(error),
      };
    }
  }

  @Post()
  async addNewSection(
    @Body() payload: AddNewSectionDto,
  ): Promise<AddNewSectionResponseDto> {
    try {
      const section = await this.sectionsService.addNewSection(payload);
      return {
        success: true,
        result: section,
      };
    } catch (error) {
      return {
        success: false,
        error: ScheduleError(error),
      };
    }
  }
}
