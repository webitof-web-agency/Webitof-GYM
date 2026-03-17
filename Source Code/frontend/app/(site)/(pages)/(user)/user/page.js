'use client';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../../components/common/page-loader';

const AccountPageContent = dynamic(() => import('./account-page-content'), {
    loading: () => <PageLoader />,
    ssr: false,
});

const AccountSettings = () => <AccountPageContent />;

export default AccountSettings;
