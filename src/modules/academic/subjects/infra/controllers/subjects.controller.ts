import { SubjectDto } from "@academic/subjects/application/dto/subject.dto";
import { SubjectService } from "@academic/subjects/application/services/subject.service";
import {
  HateoasItem,
  HateoasList,
} from "@shared/hateoas/hateoas.decorators";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";

@Controller("subjects")
export class SubjectsController {
  constructor(private readonly subjectService: SubjectService) {}

  @HateoasList<SubjectDto>({
    itemLinks: (item) => [
      { rel: "self", href: `/subjects/${item.id}`, method: "GET" },
      { rel: "update", href: `/subjects/${item.id}`, method: "PUT" },
      { rel: "delete", href: `/subjects/${item.id}`, method: "DELETE" },
    ],
  })
  @Get()
  async findAll(
    @Query("page") page = "1",
    @Query("limit") limit = "10",
  ) {
    return this.subjectService.list(parseInt(page, 10), parseInt(limit, 10));
  }

  @HateoasItem<SubjectDto>({
    itemLinks: (item) => [
      { rel: "self", href: `/subjects/${item.id}`, method: "GET" },
      { rel: "update", href: `/subjects/${item.id}`, method: "PUT" },
      { rel: "delete", href: `/subjects/${item.id}`, method: "DELETE" },
    ],
  })
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.subjectService.findById(id);
  }

  @Post()
  async create(@Body() body: SubjectDto) {
    return this.subjectService.create(body);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: SubjectDto) {
    return this.subjectService.edit(id, body);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.subjectService.remove(id);
  }
}
