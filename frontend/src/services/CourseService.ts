import Course from '../models/course/Course';
import CourseQuery from '../models/course/CourseQuery';
import ICourseWithEnrollment from '../models/course/CourseWithFlags';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import UpdateCourseRequest from '../models/course/UpdateCourseRequest';
import apiService from './ApiService';

class CourseService {
  async save(createCourseRequest: CreateCourseRequest): Promise<void> {
    await apiService.post('/api/courses', createCourseRequest);
  }

  async findAll(courseQuery: CourseQuery): Promise<Course[]> {
    return (
      await apiService.get<Course[]>('/api/courses', { params: courseQuery })
    ).data;
  }

  async findOne(id: string): Promise<Course> {
    return (await apiService.get<Course>(`/api/courses/${id}`)).data;
  }

  async update(
    id: string,
    updateCourseRequest: UpdateCourseRequest,
  ): Promise<void> {
    await apiService.put(`/api/courses/${id}`, updateCourseRequest);
  }

  async delete(id: string): Promise<void> {
    await apiService.delete(`/api/courses/${id}`);
  }

  async findAllWithUserFlag(
    userId: string,
    courseQuery: CourseQuery,
  ): Promise<ICourseWithEnrollment[]> {
    return (
      await apiService.get<ICourseWithEnrollment[]>(
        `/api/courses/with-user-flag/${userId}`,
        { params: courseQuery },
      )
    ).data;
  }
}

export default new CourseService();
