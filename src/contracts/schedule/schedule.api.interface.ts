import { Response } from 'express';
import {
  AddSectionToScheduleParamsDto,
  AddSectionToScheduleResponseDto,
  GetScheduleResponseDto,
  GetScheduleParamsDto,
  RemoveSectionFromScheduleParamsDto,
  RemoveSectionFromScheduleResponseDto,
} from './schedule.dto';

export interface IScheduleController {
  /**
   * Add section to student's schedule
   */
  addSectionToSchedule: (
    params: AddSectionToScheduleParamsDto,
  ) => Promise<AddSectionToScheduleResponseDto>;

  /**
   * Remove section from student's schedule
   */
  removeSectionFromSchedule: (
    params: RemoveSectionFromScheduleParamsDto,
  ) => Promise<RemoveSectionFromScheduleResponseDto>;

  /**
   * Get PDF schedule
   */
  getSchedule: (
    params: GetScheduleParamsDto,
    res: Response,
  ) => Promise<GetScheduleResponseDto>;
}
