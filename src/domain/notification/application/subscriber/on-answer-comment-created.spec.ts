import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { SpyInstance } from 'vitest'
import {
  SendNotificationUsecase,
  SendNotificationUsecaseRequest,
  SendNotificationUsecaseResponse,
} from '../use-cases/send-notification'
import { OnAnswerCommentCreated } from './on-answer-comment-created'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { waitFor } from 'test/utils/wait-for'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswerRepository
let answerCommentsRepository: InMemoryAnswerCommentRepository
let notificationRepository: InMemoryNotificationsRepository
let studentRepository: InMemoryStudentsRepository
let sendNotificationUseCase: SendNotificationUsecase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUsecaseRequest],
  Promise<SendNotificationUsecaseResponse>
>

describe('On Answer Comment Created', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    studentRepository = new InMemoryStudentsRepository()
    answersRepository = new InMemoryAnswerRepository(
      answerAttachmentsRepository,
      studentRepository,
    )
    answerCommentsRepository = new InMemoryAnswerCommentRepository(
      studentRepository,
    )

    notificationRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUsecase(
      notificationRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCommentCreated(answersRepository, sendNotificationUseCase)
  })

  it('should send a notification when answer has new comment', async () => {
    const answer = makeAnswer()
    const comment = makeAnswerComment({ answerId: answer.id })

    answersRepository.create(answer)
    answerCommentsRepository.create(comment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
