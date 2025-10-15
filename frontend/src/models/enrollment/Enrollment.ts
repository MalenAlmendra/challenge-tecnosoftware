/* eslint-disable prettier/prettier */


export interface ICourse {
  dateCreated: string;
  description: string;
  id: string;
  name: string;
}

export interface IUser{
  firstName: string;
  id: string;
  isActive: boolean;
  lastName: string;
  password: string;
  refreshToken: string;
  role: string;
  username: string;
}

export default interface IEnrollment {
  id: string;
  enrolledAt: Date;
  status: string;
  course: ICourse;
  user: IUser;
}
