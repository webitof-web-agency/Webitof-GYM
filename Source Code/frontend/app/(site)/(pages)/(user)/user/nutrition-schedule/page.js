'use client';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../../../components/common/page-loader';

const NutritionPageContent = dynamic(() => import('./nutrition-page-content'), {
    loading: () => <PageLoader />,
    ssr: false,
});

const Page = () => <NutritionPageContent />;

export default Page;
