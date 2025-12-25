import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [SessionModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
