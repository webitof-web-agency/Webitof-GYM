'use client';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../../../../components/common/page-loader';

const BlogAddPageContent = dynamic(() => import('./blog-add-page-content'), {
    loading: () => <PageLoader />,
    ssr: false,
});

const Page = () => <BlogAddPageContent />;

export default Page;
