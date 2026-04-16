import { StudentDto } from "@academic/students/application/dto/student.dto";
import { Student } from "@academic/students/domain/models/student.entity";
import {
  STUDENT_REPOSITORY,
  type StudentRepository,
} from "@academic/students/domain/repositories/student-repository.interface";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { PaginatedResult } from "@shared/hateoas/hateoas.types";

@Injectable()
export class StudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: StudentRepository,
  ) {}

  async create(dto: StudentDto): Promise<void> {
    const existing = await this.studentRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const student = Student.restore(dto);
    await this.studentRepository.create(student!);
  }

  async edit(id: string, dto: StudentDto): Promise<void> {
    const student = await this.studentRepository.findById(id);

    if (!student) {
      throw new NotFoundException("Student not found");
    }

    if (dto.email && dto.email !== student.email) {
      const existing = await this.studentRepository.findByEmail(dto.email);

      if (existing) {
        throw new ConflictException("Email already registered");
      }
    }

    student.withName(dto.name).withEmail(dto.email).withDocument(dto.document);
    await this.studentRepository.update(student!);
  }

  async remove(id: string): Promise<void> {
    await this.studentRepository.delete(id);
  }

  async list(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<StudentDto>> {
    const all = await this.studentRepository.findAll();
    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const items = all
      .slice((page - 1) * limit, page * limit)
      .map((row) => StudentDto.from(row)!);
    return { items, total, page, limit, totalPages };
  }

  async findById(id: string): Promise<StudentDto | null> {
    const response = await this.studentRepository.findById(id);
    return StudentDto.from(response);
  }

  async findByEmail(email: string): Promise<StudentDto | null> {
    const response = await this.studentRepository.findByEmail(email);
    return StudentDto.from(response);
  }
}
