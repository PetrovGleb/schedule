import { Controller, Get } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { ISectionsController } from "../../contracts/sections/sections.api.interface";
import { ScheduleError } from "../../utils/schedule-error";

@Controller('sections')
export class SectionsController implements ISectionsController{
  constructor(private readonly sectionsService: SectionsService) {}

  @Get()
  async getAllSections(){
    try {
      const sections = await this.sectionsService.getAllSections();
      return {
        success: true,
        result: sections
      }
    } catch (error) {
      return {
        success: false,
        error: ScheduleError(error)
      }
    }
  }
}
