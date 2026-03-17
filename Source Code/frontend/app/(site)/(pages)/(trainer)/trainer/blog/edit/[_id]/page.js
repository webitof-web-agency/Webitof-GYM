'use client';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../../../../../components/common/page-loader';

const BlogEditPageContent = dynamic(() => import('./blog-edit-page-content'), {
    loading: () => <PageLoader />,
    ssr: false,
});

const Page = (props) => <BlogEditPageContent {...props} />;

export default Page;
