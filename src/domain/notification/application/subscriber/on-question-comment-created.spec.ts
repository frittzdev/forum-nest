import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comment-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { SpyInstance } from 'vitest'
import {
  SendNotificationUsecase,
  SendNotificationUsecaseRequest,
  SendNotificationUsecaseResponse,
} from '../use-cases/send-notification'
import { OnQuestionCommentCreated } from './on-question-comment-created'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { waitFor } from 'test/utils/wait-for'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentRepository } from 'test/repositories/in=memory-attachments-repository'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let notificationRepository: InMemoryNotificationsRepository
let attachmentRepository: InMemoryAttachmentRepository
let studentRepository: InMemoryStudentsRepository
let sendNotificationUseCase: SendNotificationUsecase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUsecaseRequest],
  Promise<SendNotificationUsecaseResponse>
>

describe('On Question Comment Created', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    attachmentRepository = new InMemoryAttachmentRepository()
    studentRepository = new InMemoryStudentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentRepository,
      studentRepository,
    )
    questionCommentsRepository = new InMemoryQuestionCommentsRepository(
      studentRepository,
    )

    notificationRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUsecase(
      notificationRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionCommentCreated(questionsRepository, sendNotificationUseCase)
  })

  it('should send a notification when question has new comment', async () => {
    const question = makeQuestion()
    const comment = makeQuestionComment({ questionId: question.id })

    questionsRepository.create(question)
    questionCommentsRepository.create(comment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
