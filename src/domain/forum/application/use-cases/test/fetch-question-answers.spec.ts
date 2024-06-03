import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from '../fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository
let answersRepository: InMemoryAnswerRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answer Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()
    answersRepository = new InMemoryAnswerRepository(
      answerAttachmentsRepository,
      studentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(answersRepository)
  })

  it('should be able to fetch question answer', async () => {
    const student = makeStudent({ name: 'John Doe' })

    studentsRepository.items.push(student)

    const answer1 = makeAnswer({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })
    const answer2 = makeAnswer({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })
    const answer3 = makeAnswer({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })

    await answersRepository.create(answer1)
    await answersRepository.create(answer2)
    await answersRepository.create(answer3)

    const result = await sut.execute({
      page: 1,
      questionId: 'question-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(3)
    expect(result.value?.answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          answerId: answer1.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          answerId: answer2.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          answerId: answer3.id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated questions answer', async () => {
    const student = makeStudent({ name: 'John Doe' })

    studentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await answersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
  })
})
