import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from '../delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let studentsRepository: InMemoryStudentsRepository
let answerCommentRepository: InMemoryAnswerCommentRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment Use Case', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    answerCommentRepository = new InMemoryAnswerCommentRepository(
      studentsRepository,
    )
    sut = new DeleteAnswerCommentUseCase(answerCommentRepository)
  })

  it('should be able to delete a answer comment', async () => {
    await answerCommentRepository.create(
      makeAnswerComment(
        { authorId: new UniqueEntityId('author-1') },
        new UniqueEntityId('comment-1'),
      ),
    )

    const result = await sut.execute({
      authorId: 'author-1',
      answerCommentId: 'comment-1',
    })

    expect(result.isRight()).toBe(true)
    expect(answerCommentRepository.items).toHaveLength(0)
  })

  it('should not able to delete a answer comment from another user', async () => {
    await answerCommentRepository.create(
      makeAnswerComment(
        { authorId: new UniqueEntityId('author-1') },
        new UniqueEntityId('comment-1'),
      ),
    )

    const result = await sut.execute({
      authorId: 'author-2',
      answerCommentId: 'comment-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
