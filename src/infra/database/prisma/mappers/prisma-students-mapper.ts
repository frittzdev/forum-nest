import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Students } from '@/domain/forum/enterprise/entities/students'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaStudentsMapper {
  static toDomain(raw: PrismaUser): Students {
    return Students.create(
      {
        name: raw.name,
        password: raw.password,
        email: raw.email,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistence(students: Students): Prisma.UserUncheckedCreateInput {
    return {
      id: students.id.toString(),
      name: students.name,
      email: students.email,
      password: students.password,
    }
  }
}
