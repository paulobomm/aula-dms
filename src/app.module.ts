import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { StudentsModule } from "./modules/academic/students/students.module";
import { TeachersModule } from "./modules/academic/teachers/teachers.module";
import { DatabaseModule } from "./shared/infra/database/database.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    StudentsModule,
    TeachersModule,
    DatabaseModule,
  ],
})
export class AppModule {}
