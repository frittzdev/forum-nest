import { Either, rigth } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

export interface SendNotificationUsecaseRequest {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationUsecaseResponse = Either<
  null,
  { notification: Notification }
>

@Injectable()
export class SendNotificationUsecase {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUsecaseRequest): Promise<SendNotificationUsecaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    })

    await this.notificationRepository.create(notification)

    return rigth({ notification })
  }
}
