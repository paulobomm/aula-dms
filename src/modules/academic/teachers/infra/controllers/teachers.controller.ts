import { TeacherDto } from "@academic/teachers/application/dto/teacher.dto";
import { TeacherService } from "@academic/teachers/application/services/teacher.service";
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

@Controller("teachers")
export class TeachersController {
  constructor(private readonly teacherService: TeacherService) {}

  @HateoasList<TeacherDto>({
    itemLinks: (item) => [
      { rel: "self", href: `/teachers/${item.id}`, method: "GET" },
      { rel: "update", href: `/teachers/${item.id}`, method: "PUT" },
      { rel: "delete", href: `/teachers/${item.id}`, method: "DELETE" },
    ],
  })
  @Get()
  async findAll(
    @Query("page") page = "1",
    @Query("limit") limit = "10",
  ) {
    return this.teacherService.list(parseInt(page, 10), parseInt(limit, 10));
  }

  @HateoasItem<TeacherDto>({
    itemLinks: (item) => [
      { rel: "self", href: `/teachers/${item.id}`, method: "GET" },
      { rel: "update", href: `/teachers/${item.id}`, method: "PUT" },
      { rel: "delete", href: `/teachers/${item.id}`, method: "DELETE" },
    ],
  })
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.teacherService.findById(id);
  }

  @Post()
  async create(@Body() body: TeacherDto) {
    return this.teacherService.create(body);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: TeacherDto) {
    return this.teacherService.edit(id, body);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.teacherService.remove(id);
  }
}
