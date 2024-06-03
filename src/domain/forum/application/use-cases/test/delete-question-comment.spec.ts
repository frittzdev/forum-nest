import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comment-repository'
import { DeleteQuestionCommentUseCase } from '../delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let studentsRepository: InMemoryStudentsRepository
let questionCommentRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    questionCommentRepository = new InMemoryQuestionCommentsRepository(
      studentsRepository,
    )
    sut = new DeleteQuestionCommentUseCase(questionCommentRepository)
  })

  it('should be able to delete a comment on question', async () => {
    await questionCommentRepository.create(
      makeQuestionComment(
        { authorId: new UniqueEntityId('author-1') },
        new UniqueEntityId('comment-1'),
      ),
    )

    await sut.execute({
      authorId: 'author-1',
      questionCommentId: 'comment-1',
    })

    expect(questionCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question commment from another user', async () => {
    await questionCommentRepository.create(
      makeQuestionComment(
        { authorId: new UniqueEntityId('author-1') },
        new UniqueEntityId('comment-1'),
      ),
    )

    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId: 'comment-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
