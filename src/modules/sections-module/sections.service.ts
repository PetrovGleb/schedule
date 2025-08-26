import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IGetSections } from '../../contracts/sections/sections.api.interface';
import { toTime } from '../../utils/minutes-to-time'; // "HH:MM"

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSections(): Promise<IGetSections.Response['result']> {
    const sections = await this.prisma.sections.findMany({
      include: {
        subject: {
          select: {
            subject_name: true,
            teacher: {
              select: {
                user: { select: { full_name: true } },
              },
            },
          },
        },
        classroom: { select: { classroom: true } },
      },
      orderBy: [{ subject_id: 'asc' }, { start_time: 'asc' }],
    });

    if (!sections.length) {
      throw new NotFoundException('No sections found');
    }

    return sections.map((s) => ({
      sectionId: s.id,
      subjectName: s.subject.subject_name,
      daysOfWeek: s.days,
      startTime: toTime(s.start_time),
      endTime: toTime(s.end_time),
      duration: s.duration_minutes,
      teacher: s.subject.teacher?.user.full_name,
      classroom: s.classroom.classroom,
    }));
  }
}
