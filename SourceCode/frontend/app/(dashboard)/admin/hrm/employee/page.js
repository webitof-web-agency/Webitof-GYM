'use client';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../../components/common/page-loader';

const EmployeePageContent = dynamic(() => import('./employee-page-content'), {
    loading: () => <PageLoader />,
    ssr: false,
});

const Page = () => <EmployeePageContent />;

export default Page;
