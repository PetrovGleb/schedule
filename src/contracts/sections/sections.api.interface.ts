import { DayOfWeek } from "@prisma/client";

export namespace IGetSections {
  export interface Request {}

  export interface Response {
    success: boolean;
    result?: {
      sectionId: number;
      subjectName: string;
      startTime: string;
      endTime: string;
      duration: number;
      classroom: string;
      teacher: string;
      daysOfWeek: DayOfWeek[];
    }[],
    error?:
      | Record<string, any>
      | {
      status: number;
      message: string;
    };
  }
}

export interface ISectionsController {
  /**
   * Get all sections
   */
  getAllSections: (
    payload: IGetSections.Request
  ) => Promise<IGetSections.Response>;
}
