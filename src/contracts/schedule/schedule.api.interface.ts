import { Response } from "express";
import { StreamableFile } from "@nestjs/common";

export namespace IAddToSchedule {
  export interface Request {
    userId: number;
    sectionId: number;
  }

  export interface Response {
    success: boolean;
    error?:
      | Record<string, any>
      | {
      status: number;
      message: string;
    };
  }
}

export namespace IRemoveFromSchedule {
  export interface Request {
    userId: number;
    sectionId: number;
  }

  export interface Response {
    success: boolean;
    error?:
      | Record<string, any>
      | {
      status: number;
      message: string;
    };
  }
}

export namespace IGetSchedule {
  export interface Request {
    userId: number;
  }

  export type Response = StreamableFile | {
    success: boolean;
    error?:
      | Record<string, any>
      | {
      status: number;
      message: string;
    };
  }
}

export interface IScheduleController {
  /**
   * Add section to student's schedule
   */
  addSectionToSchedule: (
    userId: IAddToSchedule.Request["userId"],
    sectionId: IAddToSchedule.Request["sectionId"]
  ) => Promise<IAddToSchedule.Response>;

  /**
   * Remove section from student's schedule
   */
  removeSectionFromSchedule: (
    userId: IRemoveFromSchedule.Request["userId"],
    sectionId: IRemoveFromSchedule.Request["sectionId"]
  ) => Promise<IRemoveFromSchedule.Response>;

  /**
   * Get PDF schedule
   */
  getSchedule: (
    userId: IGetSchedule.Request["userId"],
    res: Response
  ) => Promise<IGetSchedule.Response>;
}
