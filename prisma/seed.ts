import { PrismaClient, Role, DayOfWeek } from '@prisma/client';
import { toMinutes } from '../src/utils/tiime-to-minutes';

if (process.env.DATABASE_SEED_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_SEED_URL;
}

const prisma = new PrismaClient();

async function main() {
  console.log('==== Seed started ====');

  await prisma.$transaction([
    prisma.schedule.deleteMany(),
    prisma.sections.deleteMany(),
    prisma.subjects.deleteMany(),
    prisma.teachers.deleteMany(),
    prisma.classroom.deleteMany(),
    prisma.users.deleteMany(),
  ]);

  const [alice, bob, victor, luc, dana, colin, uJohn, uMary, uSteeve, uKara] =
    await prisma.$transaction([
      prisma.users.create({
        data: { full_name: 'Alice Student', role: Role.STUDENT },
      }),
      prisma.users.create({
        data: { full_name: 'Bob Student', role: Role.STUDENT },
      }),
      prisma.users.create({
        data: { full_name: 'Victor Student', role: Role.STUDENT },
      }),
      prisma.users.create({
        data: { full_name: 'Luc Student', role: Role.STUDENT },
      }),
      prisma.users.create({
        data: { full_name: 'Dana Student', role: Role.STUDENT },
      }),
      prisma.users.create({
        data: { full_name: 'Colin Student', role: Role.STUDENT },
      }),

      prisma.users.create({
        data: { full_name: 'Dr. John Smith', role: Role.TEACHER },
      }),
      prisma.users.create({
        data: { full_name: 'Prof. Mary Clark', role: Role.TEACHER },
      }),
      prisma.users.create({
        data: { full_name: 'Dr. Steeve Mushroom', role: Role.TEACHER },
      }),
      prisma.users.create({
        data: { full_name: 'Prof. Kara Delavigne', role: Role.TEACHER },
      }),
    ]);

  const [tJohn, tMary, tSteeve, tKara] = await prisma.$transaction([
    prisma.teachers.create({ data: { user_id: uJohn.id } }),
    prisma.teachers.create({ data: { user_id: uMary.id } }),
    prisma.teachers.create({ data: { user_id: uSteeve.id } }),
    prisma.teachers.create({ data: { user_id: uKara.id } }),
  ]);

  const [a101, b202, c303, a102, b203, c304] = await prisma.$transaction([
    prisma.classroom.create({ data: { classroom: 'A-101' } }),
    prisma.classroom.create({ data: { classroom: 'B-202' } }),
    prisma.classroom.create({ data: { classroom: 'C-303' } }),
    prisma.classroom.create({ data: { classroom: 'A-102' } }),
    prisma.classroom.create({ data: { classroom: 'B-203' } }),
    prisma.classroom.create({ data: { classroom: 'C-304' } }),
  ]);

  const [chemistry, math, physics, philosophy] = await prisma.$transaction([
    prisma.subjects.create({
      data: { subject_name: 'General Chemistry 1', teacher_id: tJohn.id },
    }),
    prisma.subjects.create({
      data: { subject_name: 'Discrete Mathematics', teacher_id: tMary.id },
    }),
    prisma.subjects.create({
      data: { subject_name: 'Physics I', teacher_id: tSteeve.id },
    }),
    prisma.subjects.create({
      data: { subject_name: 'Philosophy', teacher_id: tKara.id },
    }),
  ]);

  async function makeSection(opts: {
    classroom_id: number;
    subject_id: number;
    days: DayOfWeek[];
    startHHMM: string;
    duration: 50 | 80;
  }) {
    const start = toMinutes(opts.startHHMM);
    const duration = opts.duration;
    const end = start + duration;

    if (start < 450)
      throw new Error(`start_time < 07:30 for ${opts.startHHMM}`);
    if (end > 1320)
      throw new Error(`end_time > 22:00 for ${opts.startHHMM}+${duration}`);
    if (![50, 80].includes(duration))
      throw new Error('duration must be 50 or 80');

    return prisma.sections.create({
      data: {
        classroom_id: opts.classroom_id,
        subject_id: opts.subject_id,
        days: opts.days,
        start_time: start,
        duration_minutes: duration,
        end_time: end,
      },
    });
  }

  await makeSection({
    classroom_id: a101.id,
    subject_id: chemistry.id,
    days: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY],
    startHHMM: '08:00',
    duration: 50,
  });

  await makeSection({
    classroom_id: b202.id,
    subject_id: math.id,
    days: [DayOfWeek.TUESDAY, DayOfWeek.THURSDAY],
    startHHMM: '09:00',
    duration: 80,
  });

  await makeSection({
    classroom_id: a101.id,
    subject_id: chemistry.id,
    days: [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
    ],
    startHHMM: '19:00',
    duration: 50,
  });

  await makeSection({
    classroom_id: a101.id,
    subject_id: chemistry.id,
    days: [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
    ],
    startHHMM: '15:00',
    duration: 80,
  });

  await makeSection({
    classroom_id: c303.id,
    subject_id: physics.id,
    days: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY],
    startHHMM: '10:00',
    duration: 50,
  });

  await makeSection({
    classroom_id: c303.id,
    subject_id: physics.id,
    days: [DayOfWeek.TUESDAY, DayOfWeek.THURSDAY],
    startHHMM: '13:00',
    duration: 80,
  });

  await makeSection({
    classroom_id: b202.id,
    subject_id: philosophy.id,
    days: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY],
    startHHMM: '12:00',
    duration: 50,
  });

  await makeSection({
    classroom_id: b202.id,
    subject_id: philosophy.id,
    days: [DayOfWeek.TUESDAY, DayOfWeek.THURSDAY],
    startHHMM: '18:00',
    duration: 80,
  });

  await makeSection({
    classroom_id: a101.id,
    subject_id: math.id,
    days: [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
    ],
    startHHMM: '07:30',
    duration: 50,
  });

  await makeSection({
    classroom_id: a101.id,
    subject_id: chemistry.id,
    days: [DayOfWeek.TUESDAY, DayOfWeek.THURSDAY],
    startHHMM: '20:40',
    duration: 80,
  });

  await makeSection({
    classroom_id: a102.id,
    subject_id: chemistry.id,
    days: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY],
    startHHMM: '11:00',
    duration: 50,
  });

  await makeSection({
    classroom_id: c304.id,
    subject_id: chemistry.id,
    days: [DayOfWeek.TUESDAY, DayOfWeek.THURSDAY],
    startHHMM: '10:30',
    duration: 80,
  });

  await makeSection({
    classroom_id: b203.id,
    subject_id: math.id,
    days: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY],
    startHHMM: '09:00',
    duration: 50,
  });

  await makeSection({
    classroom_id: a102.id,
    subject_id: math.id,
    days: [DayOfWeek.TUESDAY, DayOfWeek.THURSDAY],
    startHHMM: '14:00',
    duration: 80,
  });

  await makeSection({
    classroom_id: c304.id,
    subject_id: physics.id,
    days: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY],
    startHHMM: '14:00',
    duration: 80,
  });

  await makeSection({
    classroom_id: c303.id,
    subject_id: physics.id,
    days: [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
    ],
    startHHMM: '17:00',
    duration: 50,
  });

  await makeSection({
    classroom_id: a101.id,
    subject_id: philosophy.id,
    days: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY],
    startHHMM: '09:00',
    duration: 50,
  });

  await makeSection({
    classroom_id: b203.id,
    subject_id: philosophy.id,
    days: [DayOfWeek.TUESDAY, DayOfWeek.THURSDAY],
    startHHMM: '16:00',
    duration: 50,
  });

  await makeSection({
    classroom_id: a102.id,
    subject_id: math.id,
    days: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY],
    startHHMM: '18:00',
    duration: 50,
  });

  await makeSection({
    classroom_id: c303.id,
    subject_id: chemistry.id,
    days: [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
    ],
    startHHMM: '11:30',
    duration: 50,
  });

  console.log('==== Seed completed ====');
}

main()
  .catch((e) => {
    console.error('==== Seed error: =====', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
