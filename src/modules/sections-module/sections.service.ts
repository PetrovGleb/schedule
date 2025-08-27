import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { toTime } from '../../utils/minutes-to-time';
import {
  AddNewSectionDto,
  SectionItemDto,
} from '../../contracts/sections/sections.dto';
import { toMinutes } from '../../utils/tiime-to-minutes';

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSections(): Promise<SectionItemDto[]> {
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

  async addNewSection(payload: AddNewSectionDto): Promise<SectionItemDto> {
    const { subjectId, classroomId, startTime, duration, daysOfWeek } = payload;

    const [subject, classroom] = await Promise.all([
      this.prisma.subjects.findUnique({
        where: { id: subjectId },
        select: { id: true, subject_name: true, teacher_id: true },
      }),
      this.prisma.classroom.findUnique({
        where: { id: classroomId },
        select: { id: true, classroom: true },
      }),
    ]);
    if (!subject)
      throw new NotFoundException(`Subject #${subjectId} not found`);
    if (!classroom)
      throw new NotFoundException(`Classroom #${classroomId} not found`);

    const startMinute = toMinutes(startTime);
    const endMinute = startMinute + duration;

    const [teacherConflict, classroomConflict] = await Promise.all([
      this.prisma.sections.findFirst({
        where: {
          subject_id: subjectId,
          days: { hasSome: daysOfWeek },
          start_time: { lt: endMinute },
          end_time: { gt: startMinute },
        },
        select: {
          id: true,
          start_time: true,
          end_time: true,
          subject: { select: { subject_name: true } },
          days: true,
        },
      }),
      this.prisma.sections.findFirst({
        where: {
          classroom_id: classroomId,
          days: { hasSome: daysOfWeek },
          start_time: { lt: endMinute },
          end_time: { gt: startMinute },
        },
        select: {
          id: true,
          start_time: true,
          end_time: true,
          subject: { select: { subject_name: true } },
          days: true,
        },
      }),
    ]);

    if (teacherConflict) {
      throw new ConflictException(
        `Teacher is busy: section #${teacherConflict.id} (${teacherConflict.subject.subject_name} [${teacherConflict.days.join(', ')}] ${toTime(teacherConflict.start_time)}–${toTime(teacherConflict.end_time)}`,
      );
    }

    if (classroomConflict) {
      throw new ConflictException(
        `Classroom is busy: section #${classroomConflict.id} (${classroomConflict.subject.subject_name} [${classroomConflict.days.join(', ')}] ${toTime(classroomConflict.start_time)}–${toTime(classroomConflict.end_time)}`,
      );
    }

    const createdSection = await this.prisma.sections.create({
      data: {
        classroom_id: classroomId,
        subject_id: subjectId,
        days: daysOfWeek,
        start_time: startMinute,
        duration_minutes: duration,
        end_time: endMinute,
      },
      include: {
        subject: {
          select: {
            subject_name: true,
            teacher: { select: { user: { select: { full_name: true } } } },
          },
        },
        classroom: { select: { classroom: true } },
      },
    });

    return {
      sectionId: createdSection.id,
      subjectName: createdSection.subject.subject_name,
      startTime: toTime(createdSection.start_time),
      endTime: toTime(createdSection.end_time),
      duration: createdSection.duration_minutes,
      classroom: createdSection.classroom.classroom,
      teacher: createdSection.subject.teacher.user.full_name,
      daysOfWeek: createdSection.days,
    };
  }
}
