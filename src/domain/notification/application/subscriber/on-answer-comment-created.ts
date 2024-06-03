import { EventHandler } from '@/core/events/event-handle'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { SendNotificationUsecase } from '../use-cases/send-notification'
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created-event'
import { DomainEvents } from '@/core/events/domain-events'

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUsecase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    )
  }

  private async sendNewAnswerCommentNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString(),
    )

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Novo comentário em "${answer.content.substring(0, 40).concat('...')}"`,
        content: answerComment.content
          .substring(0, 120)
          .trimEnd()
          .concat('...'),
      })
    }
  }
}
