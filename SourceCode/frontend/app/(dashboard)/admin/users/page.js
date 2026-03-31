'use client';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../components/common/page-loader';

const UsersPageContent = dynamic(() => import('./users-page-content'), {
    loading: () => <PageLoader />,
    ssr: false,
});

const UsersList = () => <UsersPageContent />;

export default UsersList;
