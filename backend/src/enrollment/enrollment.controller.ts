import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { CreateEnrollmentDto } from './enrollment.dto';
import { Enrollment } from './enrollment.entity';
import { EnrollmentQuery } from './enrollment.query';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollments')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @Roles(Role.User)
  async create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<Enrollment> {
    return this.enrollmentService.createEnrollment(createEnrollmentDto);
  }

  @Get()
  async findAllEnrollments(
    @Query() enrollmentQuery: EnrollmentQuery,
  ): Promise<Enrollment[]> {
    return this.enrollmentService.findAllEnrollments(enrollmentQuery);
  }

  @Get('/:enrollement_id')
  async findByEnrollmentId(
    @Param('enrollement_id') enrollement_id: string,
  ): Promise<Enrollment> {
    return this.enrollmentService.findByEnrollmentId(enrollement_id);
  }

  @Delete('/:enrollement_id')
  async removeEnrollment(
    @Param('enrollement_id') enrollement_id: string,
  ): Promise<string> {
    return this.enrollmentService.removeEnrollment(enrollement_id);
  }

  @Get('/:userId/:courseId')
  async existEnrolledUser(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ): Promise<boolean> {
    return this.enrollmentService.existEnrolledUser(userId, courseId);
  }
}
