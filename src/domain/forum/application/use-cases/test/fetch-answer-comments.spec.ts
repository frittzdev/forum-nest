import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentUseCase } from '../fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let studentRepository: InMemoryStudentsRepository
let answerCommentRepository: InMemoryAnswerCommentRepository
let sut: FetchAnswerCommentUseCase

describe('Fetch Answer Comment Use Case', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentsRepository()
    answerCommentRepository = new InMemoryAnswerCommentRepository(
      studentRepository,
    )
    sut = new FetchAnswerCommentUseCase(answerCommentRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    studentRepository.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })

    await answerCommentRepository.create(comment1)
    await answerCommentRepository.create(comment2)
    await answerCommentRepository.create(comment3)

    const result = await sut.execute({
      page: 1,
      answerId: 'answer-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated answer comment', async () => {
    const student = makeStudent()

    studentRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await answerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      answerId: 'answer-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(2)
  })
})
