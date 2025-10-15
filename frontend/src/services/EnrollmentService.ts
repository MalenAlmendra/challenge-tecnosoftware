/* eslint-disable prettier/prettier */
import ICreateEnrollmentRequest from '../models/enrollment/CreateEnrollmentRequest';
import IEnrollment from '../models/enrollment/Enrollment';
import IEnrollmentQuery from '../models/enrollment/EnrollmentQuery';
import apiService from './ApiService';

class EnrollmentService {
  async createEnrollment(
    createEnrollmentRequest: ICreateEnrollmentRequest,
  ): Promise<void> {
    await apiService.post('/api/enrollments', createEnrollmentRequest);
  }

  async findAllEnrollments(
    enrollmentQuery: IEnrollmentQuery,
  ): Promise<IEnrollment[]> {
    return (
      await apiService.get<IEnrollment[]>('/api/enrollments', {
        params: enrollmentQuery,
      })
    ).data;
  }

  async findByEnrollmentId(enrollmentId: string): Promise<IEnrollment> {
    return (
      await apiService.get<IEnrollment>(`/api/enrollments/${enrollmentId}`)
    ).data;
  }

  async removeEnrollment(enrollmentId: string): Promise<void> {
    await apiService.delete<string>(`/api/enrollments/${enrollmentId}`);
  }

  async existEnrolledUser(userId:string, courseId:string): Promise<boolean>{
    return (await apiService.get<boolean>(`/api/enrollments/${userId}/${courseId}`)).data
  }
}

export default new EnrollmentService();
