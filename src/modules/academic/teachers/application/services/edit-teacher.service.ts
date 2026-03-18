import type { TeacherDto } from "@academic/teachers/application/dto/teacher.dto";
import {
  TEACHER_REPOSITORY,
  type TeacherRepository,
} from "@academic/teachers/application/repositories/teacher-repository.interface";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class EditTeacherService {
  constructor(
    @Inject(TEACHER_REPOSITORY)
    private readonly teacherRepository: TeacherRepository,
  ) {}

  async execute(id: string, dto: TeacherDto): Promise<void> {
    const teacher = await this.teacherRepository.findById(id);

    if (!teacher) {
      throw new NotFoundException("Teacher not found");
    }

    teacher
    
      .withName(dto.name)
      .withEmail(dto.email)
      .withDocument(dto.document)
      .withRegistration(dto.registration)
      .withSubject(dto.subject);

    await this.teacherRepository.update(teacher);
  }
}
