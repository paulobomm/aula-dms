import { EnrollmentDto } from "@enrollment/application/dto/enrollment.dto";
import { EnrollmentService } from "@enrollment/application/services/enrollment.service";
import { EnrollmentStatus } from "@enrollment/domain/models/enrollment.entity";
import {
  HateoasList,
} from "@shared/hateoas/hateoas.decorators";
import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";

@Controller("enrollments")
export class EnrollmentsController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @HateoasList<EnrollmentDto>({
    itemLinks: (item) => [
      item.status === EnrollmentStatus.ACTIVE
        ? { rel: "cancel", href: `/enrollments/${item.id}`, method: "DELETE" }
        : null,
    ],
  })
  @Get("class-offering/:classOfferingId")
  async findByClassOffering(
    @Param("classOfferingId") classOfferingId: string,
    @Query("page") page = "1",
    @Query("limit") limit = "10",
  ) {
    return this.enrollmentService.listByClassOffering(
      classOfferingId,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Post()
  async enroll(@Body() body: { studentId: string; classOfferingId: string }) {
    return this.enrollmentService.enroll(body);
  }

  @Delete(":id")
  async cancel(@Param("id") id: string) {
    return this.enrollmentService.cancel(id);
  }
}
