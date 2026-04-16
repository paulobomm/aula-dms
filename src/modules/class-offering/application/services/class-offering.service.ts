import { ClassOfferingDto } from "@class-offering/application/dto/class-offering.dto";
import {
  ClassOffering,
  ClassOfferingStatus,
} from "@class-offering/domain/models/class-offering.entity";
import {
  CLASS_OFFERING_REPOSITORY,
  type ClassOfferingRepository,
} from "@class-offering/domain/repositories/class-offering-repository.interface";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { PaginatedResult } from "@shared/hateoas/hateoas.types";

@Injectable()
export class ClassOfferingService {
  constructor(
    @Inject(CLASS_OFFERING_REPOSITORY)
    private readonly classOfferingRepository: ClassOfferingRepository,
  ) {}

  async create(dto: {
    subjectId: string;
    teacherId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<void> {
    const classOffering = ClassOffering.restore({
      subjectId: dto.subjectId,
      teacherId: dto.teacherId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      status: ClassOfferingStatus.ACTIVE,
    });

    await this.classOfferingRepository.create(classOffering!);
  }

  async list(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<ClassOfferingDto>> {
    const all = await this.classOfferingRepository.findAll();
    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const items = all
      .slice((page - 1) * limit, page * limit)
      .map((row) => ClassOfferingDto.from(row)!);
    return { items, total, page, limit, totalPages };
  }

  async findById(id: string): Promise<ClassOfferingDto | null> {
    const response = await this.classOfferingRepository.findById(id);
    return ClassOfferingDto.from(response);
  }

  async changeStatus(id: string, status: ClassOfferingStatus): Promise<void> {
    const classOffering = await this.classOfferingRepository.findById(id);

    if (!classOffering) {
      throw new NotFoundException("ClassOffering not found");
    }

    await this.classOfferingRepository.updateStatus(id, status);
  }
}
