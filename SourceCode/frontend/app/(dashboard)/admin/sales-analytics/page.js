'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiBarChart2, FiFilter, FiRefreshCw, FiPackage, FiShoppingCart, FiLayers, FiActivity, FiDollarSign } from 'react-icons/fi';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useFetch } from '../../../helpers/hooks';
import { fetchAdminSalesAnalytics } from '../../../helpers/backend';
import FormSelect from '../../components/form/select';
import { DatePicker } from 'antd';

const DEFAULT_FILTERS = {
    from: '',
    to: '',
    status: 'all',
    metric: 'quantity',
    limit: 8,
};

const readLabel = (name) => {
    if (typeof name === 'string') return name;
    if (name && typeof name === 'object') return name?.en || Object.values(name)[0] || 'Unknown';
    return 'Unknown';
};

/* ── Custom Tooltip ─────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#0f172a] border border-slate-700/60 rounded-xl px-4 py-3 shadow-xl">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 line-clamp-1 max-w-[160px]">{label}</p>
            {payload.map((p) => (
                <p key={p.name} className="text-[13px] font-bold" style={{ color: p.fill }}>
                    {p.name}: <span className="text-white">{Number(p.value || 0).toLocaleString()}</span>
                </p>
            ))}
        </div>
    );
};

/* ── Category row ───────────────────────────────────── */
const CATEGORY_COLORS = ['#5572fc', '#f97316', '#10b981', '#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#ef4444'];

const SalesAnalyticsPage = () => {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [data, getData, { loading }] = useFetch(fetchAdminSalesAnalytics, DEFAULT_FILTERS);

    const summary = data?.summary || {};
    const productData = useMemo(
        () => (data?.soldByProduct || []).map((item) => ({ ...item, label: readLabel(item?.name) })),
        [data?.soldByProduct]
    );
    const categoryData = data?.soldByCategory || [];
    const metricKey = filters.metric === 'amount' ? 'soldAmount' : 'soldQuantity';

    const onApplyFilters = () => getData(filters);
    const onResetFilters = () => { setFilters(DEFAULT_FILTERS); getData(DEFAULT_FILTERS); };

    const statCards = [
        { label: 'Total Stock', value: Number(summary.totalProduct || 0).toLocaleString(), icon: <FiPackage size={15} />, color: 'from-[#5572fc] to-[#4461eb]', glow: 'rgba(85,114,252,0.25)' },
        { label: 'Sold Qty', value: Number(summary.soldProduct || 0).toLocaleString(), icon: <FiShoppingCart size={15} />, color: 'from-[#f97316] to-[#ea6010]', glow: 'rgba(249,115,22,0.25)' },
        { label: 'Remaining Stock', value: Number(summary.existingProduct || 0).toLocaleString(), icon: <FiLayers size={15} />, color: 'from-[#10b981] to-[#059669]', glow: 'rgba(16,185,129,0.25)' },
        { label: 'Order Count', value: Number(summary.orderCount || 0).toLocaleString(), icon: <FiActivity size={15} />, color: 'from-[#8b5cf6] to-[#7c3aed]', glow: 'rgba(139,92,246,0.25)' },
        { label: 'Sold Amount', value: `$${Number(summary.soldAmount || 0).toLocaleString()}`, icon: <FiDollarSign size={15} />, color: 'from-[#06b6d4] to-[#0891b2]', glow: 'rgba(6,182,212,0.25)' },
    ];

    const maxCatAmount = Math.max(...categoryData.map((c) => c?.soldAmount || 0), 1);

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 pb-10">

            {/* ── Page Header ────────────────────────────── */}
            <div>
                <Link href="/admin" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-[#5572fc] transition-colors mb-2">
                    <FiArrowLeft size={13} /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f97316]/10 border border-[#f97316]/20">
                        <FiBarChart2 size={17} className="text-[#f97316]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-800 leading-tight">Sales Analytics</h1>
                        <p className="text-[11px] text-gray-400 font-medium">Top-selling products and category breakdown</p>
                    </div>
                </div>
            </div>

            {/* ── Filter Bar ─────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] p-5">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Filters</p>
                <div className="grid xl:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-3">
                    <DatePicker
                        placeholder="From Date"
                        format="YYYY-MM-DD"
                        className="!h-10 !rounded-xl !border-slate-200 !text-[13px]"
                        onChange={(_, dateStr) => setFilters((p) => ({ ...p, from: dateStr }))}
                    />
                    <DatePicker
                        placeholder="To Date"
                        format="YYYY-MM-DD"
                        className="!h-10 !rounded-xl !border-slate-200 !text-[13px]"
                        onChange={(_, dateStr) => setFilters((p) => ({ ...p, to: dateStr }))}
                    />
                    <FormSelect label="" value={filters.status} onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
                        options={[{ value: 'all', label: 'Status: All' }, { value: 'pending', label: 'Status: Pending' }, { value: 'accepted', label: 'Status: Accepted' }, { value: 'completed', label: 'Status: Completed' }, { value: 'cancelled', label: 'Status: Cancelled' }]} />
                    <FormSelect label="" value={filters.metric} onChange={(v) => setFilters((p) => ({ ...p, metric: v }))}
                        options={[{ value: 'quantity', label: 'Metric: Quantity' }, { value: 'amount', label: 'Metric: Amount' }]} />
                    <FormSelect label="" value={filters.limit} onChange={(v) => setFilters((p) => ({ ...p, limit: Number(v) }))}
                        options={[{ value: 5, label: 'Top 5' }, { value: 8, label: 'Top 8' }, { value: 10, label: 'Top 10' }, { value: 15, label: 'Top 15' }]} />
                    <div className="flex gap-2">
                        <button onClick={onApplyFilters}
                            className="h-10 flex-1 rounded-xl bg-[#5572fc] text-white text-[12px] font-bold inline-flex items-center justify-center gap-1.5 shadow-md shadow-[#5572fc]/25 hover:bg-[#4461eb] transition-colors">
                            <FiFilter size={13} /> Apply
                        </button>
                        <button onClick={onResetFilters}
                            className="h-10 w-10 rounded-xl border border-slate-200 text-gray-500 hover:border-[#5572fc] hover:text-[#5572fc] inline-flex items-center justify-center transition-all">
                            <FiRefreshCw size={13} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Stat Cards ─────────────────────────────── */}
            <div className="grid lg:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-4">
                {statCards.map((card) => (
                    <div key={card.label} className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-tight">{card.label}</p>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg`}
                                style={{ boxShadow: `0 4px 14px -2px ${card.glow}` }}>
                                {card.icon}
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-gray-800">{card.value}</p>
                        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.color}`} />
                    </div>
                ))}
            </div>

            {/* ── Chart + Category Panel ──────────────────── */}
            <div className="grid xl:grid-cols-3 grid-cols-1 gap-5">

                {/* Bar chart */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f97316]/10 border border-[#f97316]/20">
                            <FiBarChart2 size={15} className="text-[#f97316]" />
                        </div>
                        <div>
                            <h3 className="text-[13px] font-extrabold text-gray-800">Top Selling Products</h3>
                            {loading && <p className="text-[11px] text-gray-400 font-medium">Loading data…</p>}
                        </div>
                    </div>
                    <div className="h-[380px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productData} barCategoryGap="28%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="label" tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249,115,22,0.04)' }} />
                                <Bar dataKey={metricKey} fill="#f97316" radius={[6, 6, 0, 0]}
                                    name={filters.metric === 'amount' ? 'Sold Amount ($)' : 'Sold Quantity'} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category breakdown */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5572fc]/10 border border-[#5572fc]/20">
                            <FiLayers size={14} className="text-[#5572fc]" />
                        </div>
                        <h3 className="text-[13px] font-extrabold text-gray-800">Sales by Category</h3>
                    </div>

                    {/* Category list */}
                    <div className="divide-y divide-slate-50 overflow-y-auto max-h-[420px]">
                        {categoryData.length ? (
                            categoryData.map((item, index) => {
                                const pct = Math.round(((item?.soldAmount || 0) / maxCatAmount) * 100);
                                const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
                                return (
                                    <div key={`${item?._id || 'cat'}-${index}`} className="px-5 py-3.5">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
                                                <p className="text-[13px] font-bold text-gray-800 truncate">{readLabel(item?.categoryName)}</p>
                                            </div>
                                            <p className="text-[13px] font-extrabold shrink-0 ml-3" style={{ color }}>
                                                ${Number(item?.soldAmount || 0).toLocaleString()}
                                            </p>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-medium mt-1">Qty: {Number(item?.soldQuantity || 0).toLocaleString()}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <FiLayers size={28} className="text-gray-200 mb-3" />
                                <p className="text-[12px] text-gray-400 font-medium">No category sales found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesAnalyticsPage;
