import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { StatusEnum } from '../enums/status.enum';
import { CreateEnrollmentDto } from './enrollment.dto';
import { Enrollment } from './enrollment.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async createEnrollment(
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<Enrollment> {
    const entity = this.enrollmentRepository.create(createEnrollmentDto);
    const saved = await this.enrollmentRepository.save(entity);
    // (opcional) traer con relaciones
    return this.enrollmentRepository.findOne({
      where: { id: saved.id },
      relations: ['user', 'course'],
    });
  }

  async findAllEnrollments(enrollmentQuery): Promise<Enrollment[]> {
    if (enrollmentQuery.userId) {
      return await this.enrollmentRepository.find({
        where: {
          ...(enrollmentQuery.course && {
            course: { id: enrollmentQuery.course },
          }),
          ...(enrollmentQuery.user && { user: { id: enrollmentQuery.user } }),
        },
        relations: ['user', 'course'],
      });
    }

    Object.keys(enrollmentQuery).forEach((key) => {
      enrollmentQuery[key] = ILike(`%${enrollmentQuery[key]}%`);
    });
    return await this.enrollmentRepository.find({
      where: enrollmentQuery,
      order: {
        courseId: 'ASC',
        userId: 'ASC',
      },
    });
  }

  async findByEnrollmentId(enrollment_id: string): Promise<Enrollment> {
    return await this.enrollmentRepository.findOne({
      where: {
        id: enrollment_id,
      },
    });
  }

  async existEnrolledUser(userId, courseId): Promise<boolean> {
    const userExisted = await this.enrollmentRepository.findOne({
      where: {
        userId: userId,
        courseId: courseId,
      },
    });
    if (userExisted) {
      return true;
    }

    return false;
  }

  async removeEnrollment(enrollment_id: string): Promise<string> {
    const existEnrollment = await this.findByEnrollmentId(enrollment_id);
    if (existEnrollment) {
      await this.enrollmentRepository.delete({ id: enrollment_id });
      return `Id ${enrollment_id} Deleted`;
    } else {
      throw new BadRequestException(
        'No se pudo eliminar pues no existe en la bbdd',
      );
    }
  }
}
