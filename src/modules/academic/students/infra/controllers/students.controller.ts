import { StudentDto } from "@academic/students/application/dto/student.dto";
import { StudentService } from "@academic/students/application/services/student.service";
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

@Controller("students")
export class StudentsController {
  constructor(private readonly studentService: StudentService) {}

  @HateoasList<StudentDto>({
    itemLinks: (item) => [
      { rel: "self", href: `/students/${item.id}`, method: "GET" },
      { rel: "update", href: `/students/${item.id}`, method: "PUT" },
      { rel: "delete", href: `/students/${item.id}`, method: "DELETE" },
    ],
  })
  @Get()
  async findAll(
    @Query("page") page = "1",
    @Query("limit") limit = "10",
  ) {
    return this.studentService.list(parseInt(page, 10), parseInt(limit, 10));
  }

  @HateoasItem<StudentDto>({
    itemLinks: (item) => [
      { rel: "self", href: `/students/${item.id}`, method: "GET" },
      { rel: "update", href: `/students/${item.id}`, method: "PUT" },
      { rel: "delete", href: `/students/${item.id}`, method: "DELETE" },
    ],
  })
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.studentService.findById(id);
  }

  @Post()
  async create(@Body() body: StudentDto) {
    return this.studentService.create(body);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: StudentDto) {
    return this.studentService.edit(id, body);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.studentService.remove(id);
  }
}
