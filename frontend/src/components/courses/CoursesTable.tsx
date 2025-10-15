import { useState } from 'react';
import { AlertTriangle, Loader, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import ICourseWithEnrollment from '../../models/course/CourseWithFlags';
import UpdateCourseRequest from '../../models/course/UpdateCourseRequest';
import courseService from '../../services/CourseService';
import enrollmentService from '../../services/EnrollmentService';
import Modal from '../shared/Modal';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';

interface CoursesTableProps {
  data: ICourseWithEnrollment[];
  isLoading: boolean;
}

export default function CoursesTable({ data, isLoading }: CoursesTableProps) {
  const { authenticatedUser } = useAuth();
  const queryClient = useQueryClient();
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();
  const [error, setError] = useState<string>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateCourseRequest>();

  const enrollMutation = useMutation(
    ({ courseId }: { courseId: string }) =>
      enrollmentService.createEnrollment({
        userId: authenticatedUser.id,
        courseId,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('courses-with-flag');
      },
    },
  );

  const unenrollMutation = useMutation(
    ({ enrollmentId }: { enrollmentId: string }) =>
      enrollmentService.removeEnrollment(enrollmentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('courses-with-flag');
      },
    },
  );

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await courseService.delete(selectedCourseId);
      setDeleteShow(false);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateCourseRequest: UpdateCourseRequest) => {
    try {
      await courseService.update(selectedCourseId, updateCourseRequest);
      setUpdateShow(false);
      reset();
      setError(null);
      queryClient.invalidateQueries('courses-with-flag');
    } catch (error) {
      setError(error?.response?.data?.message ?? 'Unexpected error');
    }
  };
  const columns = [
    authenticatedUser.role === 'user' && 'State',
    'Name',
    'Description',
    'Created',
    'Actions',
  ].filter(Boolean);
  return (
    <>
      <div className="table-container">
        <Table columns={columns}>
          {isLoading
            ? null
            : data.map(
                ({
                  id,
                  name,
                  description,
                  dateCreated,
                  hasEnrolledUser,
                  enrollmentId,
                }) => (
                  <tr key={id}>
                    {authenticatedUser.role === 'user' ? (
                      <TableItem>
                        <span
                          className={`rounded-full text-xs px-2 py-1 font-semibold ${
                            hasEnrolledUser
                              ? 'bg-brand-primary text-brand-background'
                              : 'bg-brand-background text-brand-primary'
                          }`}
                        >
                          {hasEnrolledUser ? 'Enrolled' : 'Unenrolled'}
                        </span>
                      </TableItem>
                    ) : null}
                    <TableItem>
                      <Link className="link" to={`/courses/${id}`}>
                        {name}
                      </Link>
                    </TableItem>
                    <TableItem>{description}</TableItem>
                    <TableItem>
                      {new Date(dateCreated).toLocaleDateString()}
                    </TableItem>
                    <TableItem className="text-right">
                      {['admin', 'editor'].includes(authenticatedUser.role) ? (
                        <button
                          className="text-brand-primary hover:text-primary-white hover:bg-brand-primary focus:outline-none"
                          onClick={() => {
                            setSelectedCourseId(id);

                            setValue('name', name);
                            setValue('description', description);

                            setUpdateShow(true);
                          }}
                        >
                          Edit
                        </button>
                      ) : null}
                      {authenticatedUser.role === 'admin' ? (
                        <button
                          className="text-brand-primary hover:text-primary-white hover:bg-brand-primary ml-3 focus:outline-none"
                          onClick={() => {
                            setSelectedCourseId(id);
                            setDeleteShow(true);
                          }}
                        >
                          Delete
                        </button>
                      ) : null}
                      {authenticatedUser.role === 'user' &&
                        !hasEnrolledUser && (
                          <button
                            className="btn"
                            disabled={enrollMutation.isLoading}
                            onClick={() =>
                              enrollMutation.mutate({ courseId: id })
                            }
                          >
                            {enrollMutation.isLoading ? '...' : 'Enroll me'}
                          </button>
                        )}
                      {authenticatedUser.role === 'user' &&
                        hasEnrolledUser &&
                        enrollmentId && (
                          <button
                            className="btn danger"
                            disabled={unenrollMutation.isLoading}
                            onClick={() =>
                              unenrollMutation.mutate({ enrollmentId })
                            }
                          >
                            {unenrollMutation.isLoading ? '...' : 'Unenroll me'}
                          </button>
                        )}
                    </TableItem>
                  </tr>
                ),
              )}
        </Table>
        {!isLoading && data.length < 1 ? (
          <div className="text-center my-5 text-gray-500">
            <h1>Empty</h1>
          </div>
        ) : null}
      </div>
      {/* Delete Course Modal */}
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold">Delete Course</h3>
          <hr />
          <p className="mt-2">
            Are you sure you want to delete the course? All of course's data
            will be permanently removed.
            <br />
            This action cannot be undone.
          </p>
        </div>
        <div className="flex flex-row gap-3 justify-end mt-5">
          <button
            className="btn"
            onClick={() => {
              setError(null);
              setDeleteShow(false);
            }}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="btn danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader className="mx-auto animate-spin" />
            ) : (
              'Delete'
            )}
          </button>
        </div>
        {error ? (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
            {error}
          </div>
        ) : null}
      </Modal>
      {/* Update Course Modal */}
      <Modal show={updateShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Update Course</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              setUpdateShow(false);
              setError(null);
              reset();
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(handleUpdate)}
        >
          <input
            type="text"
            className="input"
            placeholder="Name"
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            required
            disabled={isSubmitting}
            {...register('description')}
          />
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </>
  );
}
