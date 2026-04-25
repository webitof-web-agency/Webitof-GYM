import { FaEye, FaPencilAlt, FaTimes, FaTrashAlt } from "react-icons/fa";
import { message, Modal } from 'antd';
import { useState } from "react";
import { useActionConfirm } from "../../../helpers/hooks";
import Loader from '/components/common/loader'
import SearchInput from '../../components/form/search'
import { useI18n } from "../../../providers/i18n";
import Pagination from "../../../../components/common/pagination";
import { InfinitySpin } from "react-loader-spinner";

const Table = ({
    columns,
    data,
    indexed,
    loading = false,
    noActions,
    actions,
    action,
    onView,
    onEdit,
    onDelete,
    onReload,
    pagination = false,
    shadow = true,
    title,
    noHeader = false,
    afterSearch,
    onSearchChange,
    langCode
}) => {
    const i18n = useI18n();
    const handleEditClick = (data) => {
        onEdit(data);
    };

    const handleDeleteClick = async (data) => {
        if (onDelete) {
            await useActionConfirm(
                onDelete,
                { _id: data._id },
                onReload,
                'Are you sure you want to delete this item?',
                'Yes, Delete'
            );
        }
    };

    let cols = noActions ? columns : [...columns, {
        text: i18n.t("Action"),
        dataField: 'no_actions',
        className: 'w-44 text-right',
        formatter: (noActions, data) => {
            return (
                <div className="flex justify-end items-center gap-2.5">
                    {actions && actions(data)}
                    {onView && (
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300 shadow-sm group"
                            title="View" onClick={() => onView(data)}>
                            <FaEye size={13} className="group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                    {data.disableEdit === 1 && !onView && data.disableDelete === 1 && !actions && '-'}
                    {onEdit && (data?.disableEdit !== 1) && (
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all duration-300 shadow-sm group"
                            title="Edit" onClick={() => handleEditClick(data)}>
                            <FaPencilAlt size={12} className="group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                    {onDelete && (data?.disableDelete !== 1) && (
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 shadow-sm group"
                            title="Delete" onClick={() => handleDeleteClick(data)}>
                            <FaTrashAlt size={12} className="group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                </div>
            )
        }
    }];

    return (
        <div className={`w-full bg-white ${shadow ? 'shadow-sm border border-slate-100/80' : ''} rounded-2xl overflow-hidden`}>
            {noHeader || (
                <header className="px-5 pt-4 pb-4 border-b gap-4 border-slate-100/80 flex justify-between items-center flex-wrap bg-white">
                    {title ? (
                        <>
                            {typeof title === 'string' ? (
                                <h4 className="text-lg font-bold text-slate-800 tracking-tight">{i18n?.t(title)}</h4>
                            ) : title}
                        </>
                    ) : (
                        <div className="flex flex-wrap gap-3 items-center">
                            <SearchInput
                                className="w-64 !rounded-xl !border-slate-200 focus-within:!border-[#F97316] transition-colors"
                                onChange={e => {
                                    const search = e.target.value || undefined;
                                    onReload({ search, langCode, page: 1 });
                                    onSearchChange && onSearchChange(search, langCode);
                                }}
                            />
                            {afterSearch}
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        {action}
                    </div>
                </header>
            )}
            <div className="relative">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        <thead className="bg-[#f8f9fa] border-b border-gray-100 text-gray-500 uppercase">
                            <tr>
                                {indexed && (
                                    <th className="px-4 py-3 whitespace-nowrap text-left">
                                        <div className="text-xs font-semibold tracking-wider">#</div>
                                    </th>
                                )}
                                {cols?.map((column, index) => (
                                    <th className="px-4 py-3 whitespace-nowrap text-left" key={index}>
                                        <div className={`text-xs font-semibold tracking-wider ${column?.className || ''}`}>
                                            {i18n?.t(column?.text)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100/80 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={cols.length + (indexed ? 1 : 0)} className="h-[400px]">
                                        <div className='absolute inset-0 w-full h-full flex items-center justify-center bg-white/80 backdrop-blur-sm z-10'>
                                            <InfinitySpin width='140' color='#F97316' />
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {(pagination ? data?.docs : data)?.map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-50/60 transition-colors duration-200 group">
                                            {indexed && (
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-500 font-medium text-sm">
                                                    {(pagination ? (data?.page - 1) * data.limit : 0) + index + 1}
                                                </td>
                                            )}
                                            {cols?.map((column, index) => (
                                                <td className={`px-4 py-3 whitespace-nowrap text-gray-700 font-medium ${column?.className || ''}`}
                                                    key={index}>
                                                    {column.formatter ? column.formatter(row[column.dataField], row) : (row[column.dataField] || '-')}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {((pagination ? data?.docs : data)?.length === 0 || !data) && (
                                        <tr>
                                            <td colSpan={cols.length + (indexed ? 1 : 0)} className="px-4 py-10 text-center text-gray-400 font-medium">
                                                {i18n?.t("No records found")}
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
                {pagination && data?.docs?.length > 0 && (
                    <div className="px-5 py-4 border-t border-gray-100 bg-white block w-full rounded-b-2xl">
                        <Pagination
                            page={data?.page} total={data?.totalDocs}
                            onSizeChange={limit => onReload({ limit, langCode })}
                            limit={data?.limit}
                            totalPages={data?.totalPages}
                            onPageChange={page => onReload({ page, langCode })}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Table;

export const DetailTable = ({ data, columns, title, actions }) => {
    const i18n = useI18n()
    return (
        <div className="bg-white shadow-sm border border-slate-100 rounded-2xl p-4 overflow-hidden">
            {!!title && <div className="text-lg font-bold text-slate-800 mb-4 tracking-tight border-b border-slate-100 pb-3">{i18n?.t(title)}</div>}
            <div className="body">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <tbody className="divide-y divide-gray-100 border-y border-gray-100">
                            {columns?.map((column, index) => (
                                <tr key={index} className="group hover:bg-gray-50/60 transition-colors">
                                    <td className="py-2.5 px-4 text-sm font-semibold text-gray-500 bg-gray-50/40 w-1/3 border-r border-gray-100">{i18n?.t(column?.text)}</td>
                                    <td className="py-2.5 px-4 text-sm font-medium text-gray-800">{!!data ? !!column?.formatter ? column?.formatter(data[column.dataIndex], data) : data[column.dataIndex] : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {actions && <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">{actions}</div>}
            </div>
        </div>
    )
}

export const TableImage = ({ url }) => {
    const [image, setImage] = useState();
    const finalUrl = url?.startsWith('/uploads') ? `${process.env.backend_url}${url.substring(1)}` : url;
    return (
        <div className='inline-block h-10 w-10 relative group rounded-lg overflow-hidden border border-slate-200 shadow-sm'>
            <img
                role='button'
                src={finalUrl}
                alt='Image'
                onClick={() => setImage(finalUrl)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            <Modal
                width={800}
                open={image}
                onCancel={() => setImage(undefined)}
                footer={null}
                styles={{ body: { padding: 0 } }}
                className="overflow-hidden rounded-2xl"
                closeIcon={
                    <div className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all text-white absolute top-4 right-4 z-50">
                        <FaTimes size={16} />
                    </div>
                }
            >
                <div className="flex justify-center items-center bg-slate-900/5 relative min-h-[400px]">
                    <img className='max-w-full max-h-[80vh] object-contain' src={image} alt='' />
                </div>
            </Modal>
        </div>
    );
};

