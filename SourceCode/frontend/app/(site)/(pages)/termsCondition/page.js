'use client';

import BasicBar from "../../../../components/common/basic-bar";
import { fetchSinglePage } from "../../../helpers/backend";
import { useFetch } from "../../../helpers/hooks";
import { columnFormatter } from "../../../helpers/utils";
import { useI18n } from "../../../providers/i18n";
import { FiFileText } from 'react-icons/fi';

const Page = () => {
    const [page, getPage, { loading }] = useFetch(fetchSinglePage, { slug: "terms_&_condition" });
    const i18n = useI18n();

    return (
        <div>
            <BasicBar heading={i18n?.t('Terms Condition')} subHeading={i18n?.t('Terms & Condition')} />

            <div className='container py-16 lg:py-24'>
                <div className='max-w-4xl mx-auto'>
                    {/* Page header */}
                    <div className='mb-10 flex items-start gap-5 p-7 rounded-2xl bg-gradient-to-r from-[#5572fc]/6 to-transparent border border-[#5572fc]/15'>
                        <div className='shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5572fc]/10 border border-[#5572fc]/20'>
                            <FiFileText size={22} className='text-[#5572fc]' />
                        </div>
                        <div>
                            <p className='text-[11px] font-black text-[#5572fc] uppercase tracking-widest mb-1'>{i18n?.t('Legal')}</p>
                            <h1 className='text-2xl font-extrabold text-gray-800 tracking-tight'>{i18n?.t('Terms & Condition')}</h1>
                            <p className='text-[12px] text-gray-400 font-medium mt-1'>
                                {i18n?.t('Please read these terms carefully before using our services.')}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className='space-y-4'>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={`h-4 rounded-full bg-slate-100 animate-pulse ${i % 3 === 0 ? 'w-3/4' : 'w-full'}`} />
                            ))}
                        </div>
                    ) : (
                        <div
                            dangerouslySetInnerHTML={{ __html: columnFormatter(page?.content) }}
                            className='prose prose-sm sm:prose max-w-none text-gray-600 leading-relaxed
                                prose-headings:text-gray-800 prose-headings:font-extrabold
                                prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                                prose-strong:text-gray-800 prose-strong:font-bold
                                prose-a:text-[#5572fc] prose-a:no-underline hover:prose-a:underline
                                prose-li:my-1 prose-ul:pl-5 prose-ol:pl-5'
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;