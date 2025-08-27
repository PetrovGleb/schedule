import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ScheduleError } from '../../utils/schedule-error';
import { IScheduleController } from '../../contracts/schedule/schedule.api.interface';
import { ScheduleService } from './schedule.service';
import { Response } from 'express';
import {
  AddSectionToScheduleParamsDto,
  GetScheduleParamsDto,
  GetScheduleResponseDto,
  RemoveSectionFromScheduleParamsDto,
} from '../../contracts/schedule/schedule.dto';
import { ErrorDto, SuccessDto } from '../../contracts/common/common.dto';

@Controller('schedule')
export class ScheduleController implements IScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('/:userId/:sectionId')
  async addSectionToSchedule(
    @Param() params: AddSectionToScheduleParamsDto,
  ): Promise<SuccessDto | ErrorDto> {
    try {
      await this.scheduleService.addSectionToSchedule(
        params.userId,
        params.sectionId,
      );
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: ScheduleError(error),
      };
    }
  }

  @Delete('/:userId/:sectionId')
  async removeSectionFromSchedule(
    @Param() params: RemoveSectionFromScheduleParamsDto,
  ): Promise<SuccessDto | ErrorDto> {
    try {
      await this.scheduleService.removeSectionFromSchedule(
        params.userId,
        params.sectionId,
      );
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: ScheduleError(error),
      };
    }
  }

  @Get('/:userId')
  async getSchedule(
    @Param() params: GetScheduleParamsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetScheduleResponseDto> {
    try {
      const { fileName, data } = await this.scheduleService.getSchedule(
        params.userId,
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      res.setHeader('Cache-Control', 'no-store');
      return new StreamableFile(data);
    } catch (error) {
      return {
        success: false,
        error: ScheduleError(error),
      };
    }
  }
}
