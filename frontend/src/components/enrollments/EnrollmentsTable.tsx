/* eslint-disable prettier/prettier */
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

import useAuth from '../../hooks/useAuth';
import IEnrollment from '../../models/enrollment/Enrollment';
import enrollmentService from '../../services/EnrollmentService'
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';
interface EnrollmentTableProps {
  data: IEnrollment[];
  isLoading: boolean;
}

const EnrollmentsTable = ({ data, isLoading }: EnrollmentTableProps) => {
  const queryClient = useQueryClient();

  const unenrollMutation = useMutation(
    ({ enrollmentId }: { enrollmentId: string }) =>
      enrollmentService.removeEnrollment(enrollmentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      },
    },
  );

  const { authenticatedUser } = useAuth();

  return (
    <>
      <div className="table-container">
        <Table columns={['Course', 'User', 'Enrolled', 'Status', 'Actions']}
        >
          {isLoading
            ? null
            : data.map(({ id, enrolledAt, status, user, course }) => (
              <tr key={id}>
                <TableItem>
                  {course.name}
                </TableItem>
                {
                  authenticatedUser.role === 'user'
                    ? (<TableItem>
                      {user.firstName}
                    </TableItem>)
                    : null
                }
                <TableItem>
                  {new Date(enrolledAt).toLocaleDateString()}
                </TableItem>
                <TableItem>
                  {status}
                </TableItem>
                <TableItem>
                  <button className="btn" disabled={unenrollMutation.isLoading} onClick={() =>
                    unenrollMutation.mutate({ enrollmentId: id })
                  }>{unenrollMutation.isLoading ? '...' : 'Unenroll me'}</button>
                </TableItem>
              </tr>
            ))
          }
        </Table>
        {!isLoading && data.length < 1 ? (
          <div className="text-center my-5 text-gray-500">
            <h1>Empty</h1>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default EnrollmentsTable;
