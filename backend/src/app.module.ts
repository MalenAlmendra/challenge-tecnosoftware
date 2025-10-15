import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { StatsModule } from './stats/stats.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    UserModule,
    AuthModule,
    CourseModule,
    ContentModule,
    StatsModule,
    EnrollmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
