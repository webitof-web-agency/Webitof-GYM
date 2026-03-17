'use client';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../components/common/page-loader';

const SettingsPageContent = dynamic(() => import('./settings-page-content'), {
    loading: () => <PageLoader />,
    ssr: false,
});

const AdminSettings = () => <SettingsPageContent />;

export default AdminSettings;
