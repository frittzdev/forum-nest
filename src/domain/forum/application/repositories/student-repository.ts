import { Students } from '../../enterprise/entities/students'

export abstract class StudentsRepository {
  abstract create(student: Students): Promise<void>
  abstract findByEmail(email: string): Promise<Students | null>
}
