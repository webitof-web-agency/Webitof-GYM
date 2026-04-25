'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiFilter, FiRefreshCw, FiTrendingUp, FiDollarSign, FiShoppingBag, FiCreditCard, FiActivity } from 'react-icons/fi';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useFetch } from '../../../helpers/hooks';
import { fetchAdminRevenueAnalytics } from '../../../helpers/backend';
import FormSelect from '../../components/form/select';
import { DatePicker } from 'antd';

const DEFAULT_FILTERS = {
    from: '',
    to: '',
    groupBy: 'month',
    source: 'both',
    status: 'completed',
};

const currency = (value) => `$${Number(value || 0).toLocaleString()}`;

/* ── Custom Tooltip ─────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#0f172a] border border-slate-700/60 rounded-xl px-4 py-3 shadow-xl">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
            {payload.map((p) => (
                <p key={p.name} className="text-[13px] font-bold" style={{ color: p.fill }}>
                    {p.name}: <span className="text-white">${Number(p.value || 0).toLocaleString()}</span>
                </p>
            ))}
        </div>
    );
};

const RevenueAnalyticsPage = () => {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [data, getData, { loading }] = useFetch(fetchAdminRevenueAnalytics, DEFAULT_FILTERS);

    const chartData = useMemo(
        () => (data?.chartData || []).map((item) => ({ ...item, period: item?.label })),
        [data?.chartData]
    );

    const summary = data?.summary || {};

    const onApplyFilters = () => getData(filters);
    const onResetFilters = () => { setFilters(DEFAULT_FILTERS); getData(DEFAULT_FILTERS); };

    const statCards = [
        { label: 'Total Revenue', value: currency(summary.totalRevenue), icon: <FiDollarSign size={16} />, color: 'from-[#5572fc] to-[#4461eb]', glow: 'rgba(85,114,252,0.25)' },
        { label: 'Order Revenue', value: currency(summary.orderRevenue), icon: <FiShoppingBag size={16} />, color: 'from-[#f97316] to-[#ea6010]', glow: 'rgba(249,115,22,0.25)' },
        { label: 'Subscription Revenue', value: currency(summary.subscriptionRevenue), icon: <FiCreditCard size={16} />, color: 'from-[#10b981] to-[#059669]', glow: 'rgba(16,185,129,0.25)' },
        { label: 'Total Orders', value: Number(summary.orderCount || 0).toLocaleString(), icon: <FiActivity size={16} />, color: 'from-[#8b5cf6] to-[#7c3aed]', glow: 'rgba(139,92,246,0.25)' },
        { label: 'Subscriptions', value: Number(summary.subscriptionCount || 0).toLocaleString(), icon: <FiTrendingUp size={16} />, color: 'from-[#06b6d4] to-[#0891b2]', glow: 'rgba(6,182,212,0.25)' },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 pb-10">

            {/* ── Page Header ────────────────────────────── */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <Link href="/admin" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-[#5572fc] transition-colors mb-2">
                        <FiArrowLeft size={13} /> Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5572fc]/10 border border-[#5572fc]/20">
                            <FiTrendingUp size={17} className="text-[#5572fc]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-800 leading-tight">Monthly Revenue Analytics</h1>
                            <p className="text-[11px] text-gray-400 font-medium">Track revenue from orders and subscriptions</p>
                        </div>
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
                    <FormSelect label="" value={filters.groupBy} onChange={(v) => setFilters((p) => ({ ...p, groupBy: v }))}
                        options={[{ value: 'month', label: 'Group: Month' }, { value: 'week', label: 'Group: Week' }, { value: 'day', label: 'Group: Day' }]}
                    />
                    <FormSelect label="" value={filters.source} onChange={(v) => setFilters((p) => ({ ...p, source: v }))}
                        options={[{ value: 'both', label: 'Orders + Subscriptions' }, { value: 'orders', label: 'Orders Only' }, { value: 'subscriptions', label: 'Subscriptions Only' }]}
                    />
                    <FormSelect label="" value={filters.status} onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
                        options={[{ value: 'all', label: 'Status: All' }, { value: 'pending', label: 'Status: Pending' }, { value: 'accepted', label: 'Status: Accepted' }, { value: 'completed', label: 'Status: Completed' }, { value: 'cancelled', label: 'Status: Cancelled' }]}
                    />
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

            {/* ── Chart ──────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5572fc]/10 border border-[#5572fc]/20">
                        <FiTrendingUp size={15} className="text-[#5572fc]" />
                    </div>
                    <div>
                        <h3 className="text-[13px] font-extrabold text-gray-800">Revenue Trend</h3>
                        {loading && <p className="text-[11px] text-gray-400 font-medium">Loading data…</p>}
                    </div>
                </div>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barCategoryGap="28%">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="period" tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(85,114,252,0.04)' }} />
                            <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 700, paddingTop: '16px' }} />
                            <Bar dataKey="orderRevenue" fill="#5572fc" name="Order Revenue" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="subscriptionRevenue" fill="#10b981" name="Subscription Revenue" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RevenueAnalyticsPage;
