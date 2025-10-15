import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
