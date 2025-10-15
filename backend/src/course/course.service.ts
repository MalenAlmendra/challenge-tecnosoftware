import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Enrollment } from '../enrollment/enrollment.entity';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';

export type CourseWithEnrollmentDTO = {
  id: string;
  name: string;
  description: string;
  dateCreated: Date;
  hasEnrolledUser: boolean;
  enrollmentId?: string | null;
};
@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}
  async save(createCourseDto: CreateCourseDto): Promise<Course> {
    return await this.courseRepository
      .create({
        ...createCourseDto,
        dateCreated: new Date(),
      })
      .save();
  }

  async findAll(courseQuery: CourseQuery): Promise<Course[]> {
    Object.keys(courseQuery).forEach((key) => {
      courseQuery[key] = ILike(`%${courseQuery[key]}%`);
    });
    return await this.courseRepository.find({
      where: courseQuery,
      order: {
        name: 'ASC',
        description: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne(id);
    if (!course) {
      throw new HttpException(
        `Could not find course with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);
    return await this.courseRepository
      .create({ id: course.id, ...updateCourseDto })
      .save();
  }

  async delete(id: string): Promise<string> {
    const course = await this.findById(id);
    await this.courseRepository.delete(course);
    return id;
  }

  async count(): Promise<number> {
    return await this.courseRepository.count();
  }

  async listWithUserFlag(userId: string): Promise<CourseWithEnrollmentDTO[]> {
    const builder = this.courseRepository
      .createQueryBuilder('c')
      // LEFT JOIN a la tabla/entidad de enrollments, filtrando por el user
      .leftJoin(Enrollment, 'e', 'e.courseId = c.id AND e.userId = :userId', {
        userId,
      })
      .select([
        'c.id AS id',
        'c.name AS name',
        'c.description AS description',
        'c.dateCreated AS "dateCreated"',
        `CASE WHEN e.id IS NULL THEN false ELSE true END AS "hasEnrolledUser"`,
        'e.id AS "enrollmentId"',
      ])
      .orderBy('c.name', 'ASC')
      .addOrderBy('c.description', 'ASC');

    const rows = await builder.getRawMany<{
      id: string;
      name: string;
      description: string;
      dateCreated: Date;
      hasEnrolledUser: boolean;
      enrollmentId: string | null;
    }>();

    // TypeORM devuelve raw; mapeamos al DTO fuerte:
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      dateCreated: r.dateCreated,
      hasEnrolledUser: !!r.hasEnrolledUser,
      enrollmentId: r.enrollmentId ?? null,
    }));
  }
}
