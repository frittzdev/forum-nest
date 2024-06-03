import { OnAnswerCreated } from '@/domain/notification/application/subscriber/on-answer-created'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscriber/on-question-best-answer-chosen'
import { SendNotificationUsecase } from '@/domain/notification/application/use-cases/send-notification'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnAnswerCreated,
    OnQuestionBestAnswerChosen,
    SendNotificationUsecase,
  ],
})
export class EventsModule {}
