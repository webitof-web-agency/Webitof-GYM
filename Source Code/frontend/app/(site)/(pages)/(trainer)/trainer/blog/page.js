'use client';
import { Tooltip } from 'antd';
import {
    delBlog,
    fetchBlogsTrainer,
} from '../../../../../helpers/backend';
import { useFetch } from '../../../../../helpers/hooks';
import { columnFormatter, getStatusClass } from '../../../../../helpers/utils';
import { useI18n } from '../../../../../providers/i18n';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TrainerTable from '../../../../../../components/form/trainerTable';
import Button from '../../../../../../components/common/button';

const page = () => {
    const [data, getData, { loading }] = useFetch(fetchBlogsTrainer, {});
    const i18n = useI18n();
    const { push } = useRouter();

    const columns = [
        {
            text: i18n.t('Image'),
            dataField: 'image',
            formatter: (image) => (
                <Image
                    src={image || '/defaultimg.png'}
                    alt={i18n.t('Group')}
                    width={40}
                    height={40}
                    className='h-[40px] w-[40px] rounded-full object-fill'
                />
            ),
        },
        {
            text: i18n.t('Title'),
            dataField: 'title',
            formatter: (title) => {
                const formattedTitle = columnFormatter(title);
                return (
                    <span className=''>
                        <Tooltip title={formattedTitle?.length > 30 ? formattedTitle : ''}>
                            <span className='cursor-help'>
                                {formattedTitle?.length > 30 ? formattedTitle?.slice(0, 30) + '...' : formattedTitle}
                            </span>
                        </Tooltip>
                    </span>
                );
            },
        },
        {
            text: i18n.t('Category'),
            dataField: 'category',
            formatter: (_, d) => {
                const categoryName = columnFormatter(d?.category?.name);
                return <span>{categoryName?.length > 20 ? categoryName?.slice(0, 20) + '...' : categoryName}</span>;
            },
        },
        {
            text: i18n.t('Tags'),
            dataField: 'tags',

            formatter: (_, d) =>
                d?.tags ? (
                    <span>{d?.tags?.map((tag) => columnFormatter(tag?.name)).filter(Boolean).join(', ')}</span>
                ) : (
                    <span className='text-red-500'>{i18n.t('-')}</span>
                ),
        },
        {
            text: i18n.t('Status'),
            dataField: 'published',
            formatter: (_, d) =><span className={d?.published ? getStatusClass('active') : getStatusClass('inactive')}>
                {
                    d?.published ? i18n.t('Active') : i18n.t('Inactive')
                }
            </span>     
        },
        {
            text: i18n.t('Popular'),
            dataField: 'add_to_popular',
            formatter: (_, d) =><span className={d?.add_to_popular ? getStatusClass('active') : getStatusClass('inactive')}>
                {
                    d?.add_to_popular ? i18n.t('Active') : i18n.t('Inactive')
                }
            </span>  
        },
    
    ];

    return (
        <div className=''>
            <div className='w-full overflow-x-auto overflow-y-hidden'>
                <TrainerTable
                    data={data}
                    loading={loading}
                    onReload={getData}
                    columns={columns}
                    action={
                        <Button className='!h-fit !py-3' onClick={() => push('/trainer/blog/add-blog')}
                        >
                            {i18n?.t('Add New Blog')}
                        </Button>
                    }
                    onEdit={(data) => push(`/trainer/blog/edit/${data?._id}`)}
                    onDelete={delBlog}
                    onView={(data) => push(`/trainer/blog/view/${data?._id}`)}
                    indexed
                    pagination
                    langCode={i18n?.langCode}
                />
            </div>
        </div>
    );
};

export default page;
