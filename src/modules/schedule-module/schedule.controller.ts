import { Controller, Delete, Get, Param, ParseIntPipe, Post, Res, StreamableFile } from '@nestjs/common';
import { ScheduleError } from "../../utils/schedule-error";
import {
  IAddToSchedule,
  IRemoveFromSchedule,
  IScheduleController
} from "../../contracts/schedule/schedule.api.interface";
import { ScheduleService } from "./schedule.service";
import { Response } from "express";

@Controller('schedule')
export class ScheduleController implements IScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('/:userId/:sectionId')
  async addSectionToSchedule(
    @Param('userId') userId: IAddToSchedule.Request["userId"],
    @Param('sectionId') sectionId: IAddToSchedule.Request["sectionId"],
  ){
    try {
      const success = await this.scheduleService.addSectionToSchedule(+userId, +sectionId);
      return {
        success
      }
    } catch (error) {
      return {
        success: false,
        error: ScheduleError(error)
      }
    }
  }

  @Delete('/:userId/:sectionId')
  async removeSectionFromSchedule(
    @Param('userId') userId: IRemoveFromSchedule.Request["userId"],
    @Param('sectionId') sectionId: IRemoveFromSchedule.Request["sectionId"],
  ) {
    try {
      const success = await this.scheduleService.removeSectionFromSchedule(+userId, +sectionId);
      return {
        success
      }
    } catch (error) {
      return {
        success: false,
        error: ScheduleError(error)
      }
    }
  }

  @Get('/:userId')
  async getSchedule(
    @Param('userId') userId: IRemoveFromSchedule.Request["userId"],
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { fileName, data } = await this.scheduleService.getSchedule(+userId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      res.setHeader('Cache-Control', 'no-store');
      return new StreamableFile(data);
    } catch (error) {
      return {
        success: false,
        error: ScheduleError(error)
      }
    }
  }
}
