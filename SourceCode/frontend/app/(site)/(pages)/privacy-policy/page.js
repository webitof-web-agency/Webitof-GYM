'use client';

import BasicBar from "../../../../components/common/basic-bar";
import { fetchSinglePage } from "../../../helpers/backend";
import { useFetch } from "../../../helpers/hooks";
import { columnFormatter } from "../../../helpers/utils";
import { FiShield } from 'react-icons/fi';

const Page = () => {
    const [page, getPage, { loading }] = useFetch(fetchSinglePage, { slug: "privacy_policy" });

    return (
        <div>
            <BasicBar heading='Privacy Policy' subHeading='Privacy Policy' />

            <div className='container py-16 lg:py-24'>
                <div className='max-w-4xl mx-auto'>
                    {/* Page header */}
                    <div className='mb-10 flex items-start gap-5 p-7 rounded-2xl bg-gradient-to-r from-emerald-50 to-transparent border border-emerald-100'>
                        <div className='shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200'>
                            <FiShield size={22} className='text-emerald-600' />
                        </div>
                        <div>
                            <p className='text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-1'>Legal</p>
                            <h1 className='text-2xl font-extrabold text-gray-800 tracking-tight'>Privacy Policy</h1>
                            <p className='text-[12px] text-gray-400 font-medium mt-1'>
                                Your privacy matters to us. Learn how we collect, use, and protect your data.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className='space-y-4'>
                            {[...Array(8)].map((_, i) => (
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
                                prose-a:text-[#F97316] prose-a:no-underline hover:prose-a:underline
                                prose-li:my-1 prose-ul:pl-5 prose-ol:pl-5'
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;

