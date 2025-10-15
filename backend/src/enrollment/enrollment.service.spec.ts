import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Enrollment } from './enrollment.entity';
import { EnrollmentService } from './enrollment.service';

type RepoMock<T = any> = {
  create: jest.Mock;
  save: jest.Mock;
  findOne: jest.Mock;
  find: jest.Mock;
  delete: jest.Mock;
};

const makeRepoMock = (): RepoMock => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
});

describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let repo: RepoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        {
          provide: getRepositoryToken(Enrollment),
          useValue: makeRepoMock(),
        },
      ],
    }).compile();

    service = module.get(EnrollmentService);
    repo = module.get(getRepositoryToken(Enrollment));
    jest.clearAllMocks();
  });

  describe('createEnrollment', () => {
    it('should be created, saved, and returned the entity relations', async () => {
      const dto = { userId: 'u1', courseId: 'c1', status: 'ACTIVE' } as any;
      const created = { id: undefined, ...dto };
      const saved = { id: 'e1', ...dto };
      const withRelations = {
        ...saved,
        user: { id: 'u1' },
        course: { id: 'c1' },
      };

      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(saved);
      repo.findOne.mockResolvedValue(withRelations);

      const result = await service.createEnrollment(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(created);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 'e1' },
        relations: ['user', 'course'],
      });
      expect(result).toEqual(withRelations);
    });
  });

  describe('findAllEnrollments', () => {
    it('with enrollmentQuery.userId: use "find" with conditional "where" and relations', async () => {
      const enrollmentQuery = { userId: 'u1', course: 'c1', user: 'u1' };
      const rows = [{ id: 'e1' }];
      repo.find.mockResolvedValue(rows);

      const result = await service.findAllEnrollments(enrollmentQuery as any);

      expect(repo.find).toHaveBeenCalledWith({
        where: {
          course: { id: 'c1' },
          user: { id: 'u1' },
        },
        relations: ['user', 'course'],
      });
      expect(result).toBe(rows);
    });

    it('without enrollmentQuery.userId: transforms values to ILike and sorts by courseId and userId', async () => {
      const enrollmentQuery = { user: 'john', course: 'math' };
      const rows = [{ id: 'e1' }, { id: 'e2' }];
      repo.find.mockResolvedValue(rows);

      const result = await service.findAllEnrollments({
        ...enrollmentQuery,
      } as any);

      const arg = repo.find.mock.calls[0][0];
      expect(arg.order).toEqual({ courseId: 'ASC', userId: 'ASC' });

      expect((arg.where.user as any).value).toBe('%john%');
      expect((arg.where.course as any).value).toBe('%math%');

      expect(result).toBe(rows);
    });
  });

  describe('findByEnrollmentId', () => {
    it('returns a registration by id', async () => {
      const row = { id: 'e1' };
      repo.findOne.mockResolvedValue(row);

      const result = await service.findByEnrollmentId('e1');

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'e1' } });
      expect(result).toBe(row);
    });
  });

  describe('existEnrolledUser', () => {
    it('returns true if the record exists', async () => {
      repo.findOne.mockResolvedValue({ id: 'e1' });
      await expect(service.existEnrolledUser('u1', 'c1')).resolves.toBe(true);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { userId: 'u1', courseId: 'c1' },
      });
    });

    it('returns false if the record does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.existEnrolledUser('u1', 'c1')).resolves.toBe(false);
    });
  });

  describe('removeEnrollment', () => {
    it('delete and return message if (according to current implementation) enters branch "exists"', async () => {
      jest
        .spyOn(service, 'findByEnrollmentId')
        .mockResolvedValueOnce({ id: 'e1' } as any);
      repo.delete.mockResolvedValue({ affected: 1 });

      const msg = await service.removeEnrollment('e1');

      expect(repo.delete).toHaveBeenCalledWith({ id: 'e1' });
      expect(msg).toBe('Id e1 Deleted');
    });

    it('BadRequestException should be thrown if it doesnt exist', async () => {
      jest
        .spyOn(service, 'findByEnrollmentId')
        .mockResolvedValueOnce(null as any);

      await expect(service.removeEnrollment('e404')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });
});
