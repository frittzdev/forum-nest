import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { CommentOnAnswerUseCase } from '../comment-on-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let answerCommentRepostory: InMemoryAnswerCommentRepository
let studentsRepository: InMemoryStudentsRepository
let answerRepository: InMemoryAnswerRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment On Answer Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()
    answerRepository = new InMemoryAnswerRepository(
      answerAttachmentsRepository,
      studentsRepository,
    )
    answerCommentRepostory = new InMemoryAnswerCommentRepository(
      studentsRepository,
    )
    sut = new CommentOnAnswerUseCase(answerRepository, answerCommentRepostory)
  })

  it('should be able to comment on answer', async () => {
    await answerRepository.create(
      makeAnswer({}, new UniqueEntityId('answer-1')),
    )

    const result = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'test comment',
    })

    expect(result.isRight()).toBe(true)
    expect(answerCommentRepostory.items[0].content).toEqual('test comment')
  })
})
