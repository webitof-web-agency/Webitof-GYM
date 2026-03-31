'use client';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../../../components/common/page-loader';

const TestimonialPageContent = dynamic(() => import('./testimonial-page-content'), {
    loading: () => <PageLoader />,
    ssr: false,
});

const Page = () => <TestimonialPageContent />;

export default Page
