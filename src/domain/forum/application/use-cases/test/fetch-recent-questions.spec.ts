import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchRecentQuestionsUseCase } from '../fetch-recent-questions'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryAttachmentRepository } from 'test/repositories/in=memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let attachmentsRepository: InMemoryAttachmentRepository
let studentsRepository: InMemoryStudentsRepository
let questionRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions Use Case', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentRepository()
    studentsRepository = new InMemoryStudentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(questionRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await questionRepository.create(
      makeQuestion({
        createdAt: new Date(2024, 4, 14),
      }),
    )
    await questionRepository.create(
      makeQuestion({
        createdAt: new Date(2024, 4, 15),
      }),
    )
    await questionRepository.create(
      makeQuestion({
        createdAt: new Date(2024, 4, 20),
      }),
    )

    const result = await sut.execute({ page: 1 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 4, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 4, 15) }),
      expect.objectContaining({ createdAt: new Date(2024, 4, 14) }),
    ])
  })

  it('should be able to fetch paginatied recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionRepository.create(makeQuestion())
    }

    const result = await sut.execute({ page: 2 })

    expect(result.value?.questions).toHaveLength(2)
  })
})
