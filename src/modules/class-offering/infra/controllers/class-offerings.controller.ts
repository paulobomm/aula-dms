import { ClassOfferingDto } from "@class-offering/application/dto/class-offering.dto";
import { ClassOfferingService } from "@class-offering/application/services/class-offering.service";
import {
  ClassOfferingStatus,
} from "@class-offering/domain/models/class-offering.entity";
import {
  HateoasItem,
  HateoasList,
} from "@shared/hateoas/hateoas.decorators";
import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";

@Controller("class-offerings")
export class ClassOfferingsController {
  constructor(private readonly classOfferingService: ClassOfferingService) {}

  @HateoasList<ClassOfferingDto>({
    itemLinks: (item) => [
      { rel: "self", href: `/class-offerings/${item.id}`, method: "GET" },
      item.status === ClassOfferingStatus.ACTIVE
        ? { rel: "deactivate", href: `/class-offerings/${item.id}/status`, method: "PATCH" }
        : { rel: "activate", href: `/class-offerings/${item.id}/status`, method: "PATCH" },
      item.status === ClassOfferingStatus.ACTIVE
        ? { rel: "enroll", href: `/enrollments`, method: "POST" }
        : null,
    ],
  })
  @Get()
  async findAll(
    @Query("page") page = "1",
    @Query("limit") limit = "10",
  ) {
    return this.classOfferingService.list(
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @HateoasItem<ClassOfferingDto>({
    itemLinks: (item) => [
      { rel: "self", href: `/class-offerings/${item.id}`, method: "GET" },
      item.status === ClassOfferingStatus.ACTIVE
        ? { rel: "deactivate", href: `/class-offerings/${item.id}/status`, method: "PATCH" }
        : { rel: "activate", href: `/class-offerings/${item.id}/status`, method: "PATCH" },
      item.status === ClassOfferingStatus.ACTIVE
        ? { rel: "enroll", href: `/enrollments`, method: "POST" }
        : null,
    ],
  })
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.classOfferingService.findById(id);
  }

  @Post()
  async create(
    @Body()
    body: {
      subjectId: string;
      teacherId: string;
      startDate: Date;
      endDate: Date;
    },
  ) {
    return this.classOfferingService.create(body);
  }

  @Patch(":id/status")
  async changeStatus(
    @Param("id") id: string,
    @Body() body: { status: ClassOfferingStatus },
  ) {
    return this.classOfferingService.changeStatus(id, body.status);
  }
}
