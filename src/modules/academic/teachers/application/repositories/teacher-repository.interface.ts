export class Teacher {
  id: string;
  name: string;
  email: string;
  document: string;
  registration: string;
  subject: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, name: string, email: string, document: string, registration: string, subject: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.document = document;
    this.registration = registration;
    this.subject = subject;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  withName(name: string): Teacher {
    this.name = name;
    return this;
  }

  withEmail(email: string): Teacher {
    this.email = email;
    return this;
  }

  withDocument(document: string): Teacher {
    this.document = document;
    return this;
  }

  withRegistration(registration: string): Teacher {
    this.registration = registration;
    return this;
  }

  withSubject(subject: string): Teacher {
    this.subject = subject;
    return this;
  }
}

export const TEACHER_REPOSITORY = Symbol("TEACHER_REPOSITORY");

export interface TeacherRepository {
  create(teacher: Teacher): Promise<void>;
  update(teacher: Teacher): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Teacher[]>;
  findById(id: string): Promise<Teacher | null>;
  findByEmail(email: string): Promise<Teacher | null>;
}
