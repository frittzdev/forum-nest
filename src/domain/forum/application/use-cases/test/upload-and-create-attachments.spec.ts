import { InMemoryAttachmentRepository } from 'test/repositories/in=memory-attachments-repository'
import { UploadAndCreateAttachmentsUseCase } from '../upload-and-create-attachments'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentTypeError } from '../errors/invalid-attachments-type-error'

let attachmentsRepository: InMemoryAttachmentRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentsUseCase

describe('Upload and Create Attachments Use case', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentsUseCase(
      attachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able to   upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: attachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload and create an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'image/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
