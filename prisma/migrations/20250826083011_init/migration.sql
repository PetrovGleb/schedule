-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('STUDENT', 'TEACHER');

-- CreateEnum
CREATE TYPE "public"."DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Teachers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subjects" (
    "id" SERIAL NOT NULL,
    "subject_name" TEXT NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    CONSTRAINT "Subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Classroom" (
    "id" SERIAL NOT NULL,
    "classroom" TEXT NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sections" (
    "id" SERIAL NOT NULL,
    "classroom_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "days" "public"."DayOfWeek"[],
    "start_time" INTEGER NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "end_time" INTEGER NOT NULL,

    CONSTRAINT "Sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Schedule" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Teachers_user_id_idx" ON "public"."Teachers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subjects_subject_name_key" ON "public"."Subjects"("subject_name");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_classroom_key" ON "public"."Classroom"("classroom");

-- CreateIndex
CREATE INDEX "Classroom_classroom_idx" ON "public"."Classroom"("classroom");

-- CreateIndex
CREATE INDEX "Sections_subject_id_idx" ON "public"."Sections"("subject_id");

-- CreateIndex
CREATE INDEX "Sections_classroom_id_idx" ON "public"."Sections"("classroom_id");

-- CreateIndex
CREATE INDEX "Sections_start_time_end_time_idx" ON "public"."Sections"("start_time", "end_time");

-- CreateIndex
CREATE INDEX "Schedule_user_id_idx" ON "public"."Schedule"("user_id");

-- CreateIndex
CREATE INDEX "Schedule_section_id_idx" ON "public"."Schedule"("section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_user_id_section_id_key" ON "public"."Schedule"("user_id", "section_id");

-- AddForeignKey
ALTER TABLE "public"."Teachers" ADD CONSTRAINT "Teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subjects" ADD CONSTRAINT "Subjects_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."Teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sections" ADD CONSTRAINT "Sections_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "public"."Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sections" ADD CONSTRAINT "Sections_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."Subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."Sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
