import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from '../register-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { StudentsAlreadyExistsError } from '../errors/student-already-exists-error'
import { makeStudent } from 'test/factories/make-student'

let studentRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Student Use Case', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(studentRepository, fakeHasher)
  })

  it('should be able tro register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: studentRepository.items[0],
    })
  })

  it('should not be able to register with same email twice', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
    })

    await studentRepository.create(student)

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(StudentsAlreadyExistsError)
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(studentRepository.items[0].password).toEqual(hashedPassword)
  })
})
