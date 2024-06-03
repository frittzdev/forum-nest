import { StudentsRepository } from '@/domain/forum/application/repositories/student-repository'
import { Students } from '@/domain/forum/enterprise/entities/students'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Students[] = []

  async create(student: Students) {
    this.items.push(student)
  }

  async findByEmail(email: string) {
    const student = this.items.find((item) => item.email === email)

    if (!student) {
      return null
    }
    return student
  }
}
