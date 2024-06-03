import { StudentsRepository } from '@/domain/forum/application/repositories/student-repository'
import { Students } from '@/domain/forum/enterprise/entities/students'
import { Injectable } from '@nestjs/common'
import { PrismaStudentsMapper } from '../mappers/prisma-students-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(student: Students): Promise<void> {
    const data = PrismaStudentsMapper.toPersistence(student)

    await this.prisma.user.create({
      data,
    })
  }

  async findByEmail(email: string): Promise<Students | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!student) {
      return null
    }

    return PrismaStudentsMapper.toDomain(student)
  }
}
