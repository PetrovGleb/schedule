import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DayOfWeek, Role } from "@prisma/client";
import PDFDocument from 'pdfkit';
import { DaysOfWeekMap } from "../../contracts/schedule/schedule.constants";
import { toTime } from "../../utils/minutes-to-time";

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async addSectionToSchedule(userId: number, sectionId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId, role: Role.STUDENT },
      select: { id: true, full_name: true },
    });

    if (!user) {
      throw new NotFoundException('Given student does not exist');
    }

    const section = await this.prisma.sections.findUnique({
      where: { id: sectionId }
    });
    if (!section) {
      throw new NotFoundException(`Section #${sectionId} not found`);
    }

    const alreadyInSchedule = await this.prisma.schedule.findUnique({
      where: { user_id_section_id: { user_id: userId, section_id: sectionId } },
    });

    if (alreadyInSchedule) {
      throw new ConflictException(`User ${user.full_name} is already enrolled in section #${sectionId}`);
    }

    const conflicts = await this.prisma.sections.findMany({
      where: {
        schedules: { some: { user_id: userId } },
        days: { hasSome: section.days },
        start_time: { lt: section.end_time },
        end_time: { gt: section.start_time },
      },
      select: {
        id: true,
        days: true,
        start_time: true,
        end_time: true,
        duration_minutes: true,
        subject: { select: { subject_name: true } },
      },
    });

    if (conflicts.length > 0) {
      const c = conflicts[0];
      throw new ConflictException(
        `Time conflict with section #${c.id} (${c.subject.subject_name})`
      );
    }

    try {
      await this.prisma.schedule.create({
        data: { user_id: userId, section_id: sectionId },
        include: {
          section: {
            select: {
              id: true,
              days: true,
              start_time: true,
              end_time: true,
              duration_minutes: true,
              subject: { select: { subject_name: true } },
              classroom: { select: { classroom: true } },
            },
          },
        },
      });
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeSectionFromSchedule(userId: number, sectionId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId, role: Role.STUDENT },
      select: { full_name: true },
    });
    if (!user) {
      throw new NotFoundException('Given student does not exist');
    }

    const section = await this.prisma.sections.findUnique({
      where: { id: sectionId },
    });
    if (!section) {
      throw new NotFoundException(`Section #${sectionId} not found`);
    }

    const scheduleEntry = await this.prisma.schedule.findUnique({
      where: { user_id_section_id: { user_id: userId, section_id: sectionId } },
    });
    if (!scheduleEntry) {
      throw new NotFoundException(
        `User ${user.full_name} is not enrolled in section #${sectionId}`,
      );
    }

    try {
      await this.prisma.schedule.delete({
        where: { user_id_section_id: { user_id: userId, section_id: sectionId } },
      });
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getSchedule(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId, role: Role.STUDENT },
      select: { id: true, full_name: true },
    });

    if (!user) {
      throw new NotFoundException('Given student does not exist');
    }

    const scheduleRows = await this.prisma.schedule.findMany({
      where: { user_id: userId },
      include: {
        section: {
          include: {
            classroom: { select: { classroom: true } },
            subject: {
              select: {
                subject_name: true,
                teacher: { select: { user: { select: { full_name: true } } } },
              },
            },
          },
        },
      },
    });

    type ScheduleLinesType = {
      day: DayOfWeek;
      start: number;
      end: number;
      subject: string;
      teacher: string;
      room: string;
    };

    const scheduleLines: ScheduleLinesType[] = [];
    for (const scheduleRow of scheduleRows) {
      const section = scheduleRow.section;
      const teacher = section.subject.teacher?.user.full_name ?? '—';
      for (const day of section.days) {
        scheduleLines.push({
          day: day,
          start: section.start_time,
          end: section.end_time,
          subject: section.subject.subject_name,
          teacher,
          room: section.classroom.classroom,
        });
      }
    }

    if (scheduleLines.length === 0) {
      throw new NotFoundException('Student has no sections in schedule');
    }

    const scheduleByDay = new Map<DayOfWeek, ScheduleLinesType[]>();
    const dayOrder = Object.keys(DaysOfWeekMap);
    for (const day of dayOrder) scheduleByDay.set(day as DayOfWeek, []);
    for (const scheduleLine of scheduleLines) scheduleByDay.get(scheduleLine.day)!.push(scheduleLine);
    for (const day of dayOrder) {
      scheduleByDay.get(day as DayOfWeek)!.sort((a, b) => a.start - b.start);
    }

    const doc = new PDFDocument({ size: 'A4', margin: 36 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    const done = new Promise<Buffer>((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

    doc.fontSize(18).text(user.full_name, { underline: true });
    doc.moveDown();

    for (const day of dayOrder) {
      const list = scheduleByDay.get(day as DayOfWeek)!;
      if (list.length === 0) continue;

      doc.fontSize(14).text(DaysOfWeekMap[day], { underline: true });
      doc.moveDown(0.25);

      for (const item of list) {
        const line =
          `${toTime(item.start)}–${toTime(item.end)} | ` +
          `${item.subject} | ${item.teacher} | ${item.room}`;
        doc.fontSize(11).text(line);
      }
      doc.moveDown();
    }

    doc.end();
    const data = await done;
    return { fileName: `schedule-${userId}.pdf`, data };
  }
}
