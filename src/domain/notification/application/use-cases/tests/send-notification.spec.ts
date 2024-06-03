import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'
import { SendNotificationUsecase } from '../send-notification'

let notificationRepository: InMemoryNotificationsRepository
let sut: SendNotificationUsecase

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUsecase(notificationRepository)
  })

  it('should be able to create a notification', async () => {
    const result = await sut.execute({
      recipientId: 'recipient-1',
      title: 'new notification',
      content: 'notification content',
    })

    expect(result.isRight()).toBe(true)
    expect(notificationRepository.items[0]).toEqual(result.value?.notification)
  })
})
