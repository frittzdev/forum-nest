import { DomainEvent } from '@/core/events/domain-event'
import { AnswerComment } from '../entities/answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class AnswerCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public answerComment: AnswerComment

  constructor(answerComment: AnswerComment) {
    this.answerComment = answerComment
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.answerComment.id
  }
}
