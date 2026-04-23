import type { Subject } from "@academic/subjects/domain/models/subject.entity";

export class SubjectDto {
  private constructor(
    public id: string | undefined,
    public name: string,
    public code: string,
    public workload: number,
    public description: string,
  ) {}

  public static from(subject: Subject | null): SubjectDto | null {
    if (!subject) return null;
    return new SubjectDto(
      subject.id,
      subject.name,
      subject.code,
      subject.workload,
      subject.description,
    );
  }
}
