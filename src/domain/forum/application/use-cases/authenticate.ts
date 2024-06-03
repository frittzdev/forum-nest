import { Either, left, rigth } from '@/core/either'
import { StudentsRepository } from '../repositories/student-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCrendentialsError } from './errors/wrong-crendentials-error'
import { Injectable } from '@nestjs/common'

interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCrendentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentRepository.findByEmail(email)
    if (!student) {
      return left(new WrongCrendentialsError())
    }

    const isPassowordValid = await this.hashComparer.compare(
      password,
      student.password,
    )
    if (!isPassowordValid) {
      return left(new WrongCrendentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return rigth({ accessToken })
  }
}
