import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SectionsModule } from './modules/sections-module/sections.module';
import { ScheduleModule } from './modules/schedule-module/schedule.module';

@Module({
  imports: [PrismaModule, SectionsModule, ScheduleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
