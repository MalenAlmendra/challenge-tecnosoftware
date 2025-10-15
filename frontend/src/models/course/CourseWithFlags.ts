/* eslint-disable prettier/prettier */
export default interface ICourseWithEnrollment {
  id: string;
  name: string;
  description: string;
  dateCreated: string; // viene como ISO; lo formateás al render
  hasEnrolledUser: boolean;
  enrollmentId?: string | null;
}
