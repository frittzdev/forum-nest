import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Students,
  StudentsProps,
} from '@/domain/forum/enterprise/entities/students'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaStudentsMapper } from '@/infra/database/prisma/mappers/prisma-students-mapper'

export function makeStudent(
  override: Partial<StudentsProps> = {},
  id?: UniqueEntityId,
) {
  const student = Students.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return student
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(
    data: Partial<StudentsProps> = {},
  ): Promise<Students> {
    const student = makeStudent(data)

    await this.prisma.user.create({
      data: PrismaStudentsMapper.toPersistence(student),
    })

    return student
  }
}
