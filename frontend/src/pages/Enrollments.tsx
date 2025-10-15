/* eslint-disable prettier/prettier */
import React from 'react';
import { useQuery } from 'react-query';

import EnrollmentsTable from '../components/enrollments/EnrollmentsTable';
import Layout from '../components/layout';
import useAuth from '../hooks/useAuth';
import enrollmentService from '../services/EnrollmentService'

const Enrollments = () => {
    const { authenticatedUser } = useAuth()
    const { data, isLoading } = useQuery(
        ['enrollments'],
        async () => {
            const enrollments = await enrollmentService.findAllEnrollments({
                userId: authenticatedUser.role === 'user' ? authenticatedUser.id : undefined,
            });
            return enrollments;
        },
        {
            enabled: !!authenticatedUser,
        },
    );

    return (
        <Layout>
            <h1 className="font-semibold text-3x">Enrollments</h1>
            <hr />
            <EnrollmentsTable data={data} isLoading={isLoading}></EnrollmentsTable>
        </Layout>
    )


};

export default Enrollments;
