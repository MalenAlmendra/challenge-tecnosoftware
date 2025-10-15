import { Test, TestingModule } from '@nestjs/testing';

import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';

describe('EnrollmentController', () => {
  let controller: EnrollmentController;

  const enrollment = {
    id: 'enrollment-1',
    user: { id: 'user-1' },
    course: { id: 'course-1' },
    status: 'ACTIVE',
  } as any;

  const enrollmentList = [enrollment] as any[];

  const serviceMock = {
    createEnrollment: jest.fn(),
    findAllEnrollments: jest.fn(),
    findByEnrollmentId: jest.fn(),
    removeEnrollment: jest.fn(),
    existEnrolledUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentController],
      providers: [{ provide: EnrollmentService, useValue: serviceMock }],
    }).compile();

    controller = module.get<EnrollmentController>(EnrollmentController);
  });

  it('should call the service createEnrollment method and return the created enrollment', async () => {
    serviceMock.createEnrollment.mockResolvedValue(enrollment);

    const dto = { user_id: 'user-1', course_id: 'course-1' } as any;
    const result = await controller.create(dto);

    expect(serviceMock.createEnrollment).toHaveBeenCalledTimes(1);
    expect(serviceMock.createEnrollment).toHaveBeenCalledWith(dto);
    expect(result).toBe(enrollment);
  });

  it('should throw an error when the service createEnrollment method fails', async () => {
    const error = new Error('Service error');
    serviceMock.createEnrollment.mockRejectedValue(error);

    await expect(controller.create({} as any)).rejects.toThrow(error);
  });

  it('should call the service findAllEnrollments method with query parameters and return a list of enrollments', async () => {
    serviceMock.findAllEnrollments.mockResolvedValue(enrollmentList);

    const query = { user: 'john', course: 'math' } as any;
    const result = await controller.findAllEnrollments(query);

    expect(serviceMock.findAllEnrollments).toHaveBeenCalledWith(query);
    expect(result).toBe(enrollmentList);
  });

  it('should throw an error when the service findAllEnrollments method fails', async () => {
    const error = new Error('Database error');
    serviceMock.findAllEnrollments.mockRejectedValue(error);

    await expect(controller.findAllEnrollments({} as any)).rejects.toThrow(
      error,
    );
  });

  it('should call the service findByEnrollmentId method and return an enrollment', async () => {
    serviceMock.findByEnrollmentId.mockResolvedValue(enrollment);

    const result = await controller.findByEnrollmentId('enrollment-1');

    expect(serviceMock.findByEnrollmentId).toHaveBeenCalledWith('enrollment-1');
    expect(result).toBe(enrollment);
  });

  it('should throw an error when the service findByEnrollmentId method fails', async () => {
    const error = new Error('Not found');
    serviceMock.findByEnrollmentId.mockRejectedValue(error);

    await expect(controller.findByEnrollmentId('invalid-id')).rejects.toThrow(
      error,
    );
  });

  it('should call the service removeEnrollment method and return the result message', async () => {
    serviceMock.removeEnrollment.mockResolvedValue(
      'Enrollment removed successfully',
    );

    const result = await controller.removeEnrollment('enrollment-1');

    expect(serviceMock.removeEnrollment).toHaveBeenCalledWith('enrollment-1');
    expect(result).toBe('Enrollment removed successfully');
  });

  it('should throw an error when the service removeEnrollment method fails', async () => {
    const error = new Error('Cannot delete enrollment');
    serviceMock.removeEnrollment.mockRejectedValue(error);

    await expect(controller.removeEnrollment('invalid-id')).rejects.toThrow(
      error,
    );
  });

  it('should call the service existEnrolledUser method and return a boolean value', async () => {
    serviceMock.existEnrolledUser.mockResolvedValue(true);

    const result = await controller.existEnrolledUser('user-1', 'course-1');

    expect(serviceMock.existEnrolledUser).toHaveBeenCalledWith(
      'user-1',
      'course-1',
    );
    expect(result).toBe(true);
  });

  it('should throw an error when the service existEnrolledUser method fails', async () => {
    const error = new Error('Service error');
    serviceMock.existEnrolledUser.mockRejectedValue(error);

    await expect(
      controller.existEnrolledUser('user-1', 'course-1'),
    ).rejects.toThrow(error);
  });
});
