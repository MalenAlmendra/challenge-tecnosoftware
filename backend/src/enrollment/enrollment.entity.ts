import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Course } from '../course/course.entity';
import { StatusEnum } from '../enums/status.enum';
import { User } from '../user/user.entity';

@Entity()
export class Enrollment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enrolledAt: Date;

  @Column({ type: 'enum', enum: StatusEnum, default: 'active' })
  status: string;

  @ManyToOne(() => User, (user) => user.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ name: 'courseId', type: 'uuid' })
  courseId: string;
}
