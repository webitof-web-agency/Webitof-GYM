'use client';
import dynamic from 'next/dynamic';
import { useI18n } from '../../providers/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { fetchAdminDashboardData, fetchUser } from '../../helpers/backend';
import { useFetch } from '../../helpers/hooks';
import { FiUsers, FiShoppingCart, FiArrowRight, FiTrendingUp, FiBox, FiEye } from 'react-icons/fi';
import { TbBellRingingFilled } from "react-icons/tb";
import { BsCartPlusFill } from "react-icons/bs";
import Table from '../components/form/table';
import { columnFormatter, getStatusClass } from '../../helpers/utils';
import { useRouter } from 'next/navigation';
import { FaUsers, FaDumbbell } from "react-icons/fa";
import { TbUsersGroup } from "react-icons/tb";
import { LiaUsersSolid } from "react-icons/lia";
import dayjs from 'dayjs';

const MonthlyEarningsChart = dynamic(() => import('../components/common/adminChart'), {
    ssr: false,
    loading: () => <div className="h-[300px] animate-pulse rounded-xl bg-slate-100" />,
});

const DonutChart = dynamic(() => import('../components/form/pieChartComponent'), {
    ssr: false,
    loading: () => <div className="h-[300px] animate-pulse rounded-xl bg-slate-100" />,
});

// â”€â”€ Stat Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const StatCard = ({ title, value, icon: Icon, gradient, accent }) => (
    <div className={`relative overflow-hidden bg-white rounded-xl border border-slate-100/80 shadow-sm p-5 group hover:shadow-md transition-all`}>
        <div className={`absolute inset-0 opacity-[0.03] ${gradient}`} />
        <div className="flex items-start justify-between">
            <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{title}</p>
                <p className="text-3xl font-extrabold text-gray-800 leading-none">{(value ?? 0).toLocaleString()}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
        </div>
        <div className={`mt-4 h-1 rounded-full opacity-20 ${gradient}`} />
    </div>
);

const page = () => {
    const [user] = useFetch(fetchUser);
    const router = useRouter();
    const [data] = useFetch(fetchAdminDashboardData);
    const i18n = useI18n();

    const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A';

    const statCards = [
        { title: i18n?.t('Total Users'), value: data?.totalUsers, icon: FiUsers, gradient: 'bg-orange-500', accent: 'bg-orange-500' },
        { title: i18n?.t('Total Trainers'), value: data?.totalTrainers, icon: FaDumbbell, gradient: 'bg-emerald-500', accent: 'bg-emerald-500' },
        { title: i18n?.t('Total Employees'), value: data?.totalEmployee, icon: LiaUsersSolid, gradient: 'bg-amber-500', accent: 'bg-amber-500' },
        { title: i18n?.t('Total Groups'), value: data?.totalGroups, icon: TbUsersGroup, gradient: 'bg-purple-500', accent: 'bg-purple-500' },
        { title: i18n?.t('Total Orders'), value: data?.totalOrders, icon: BsCartPlusFill, gradient: 'bg-[#F97316]', accent: 'bg-[#F97316]' },
        { title: i18n?.t('Active Subscriptions'), value: data?.totalPaidSubscription, icon: TbBellRingingFilled, gradient: 'bg-lime-500', accent: 'bg-lime-500' },
    ];

    const columns = [
        {
            text: "Order ID",
            dataField: "uid",
            formatter: (_, d) => (
                <span className="font-mono text-[11px] font-bold text-[#F97316] bg-[#F97316]/5 px-2 py-1 rounded">
                    #{d?.uid}
                </span>
            ),
        },
        {
            text: "Date",
            dataField: "date",
            formatter: (_, d) => (
                <span className="text-[11px] text-gray-500 font-medium">
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
        {
            text: "Total",
            dataField: "total",
            formatter: (_, d) => (
                <span className="font-bold text-emerald-600 text-sm font-mono">
                    {d?.subTotal}
                </span>
            ),
        },
        {
            text: "Payment Status",
            dataField: "status",
            formatter: (_, d) => (
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded border ${getStatusClass(d?.payment?.status)}`}>
                    {d?.payment?.status}
                </span>
            ),
        },
        {
            text: "Method",
            dataField: "event",
            formatter: (_, d) => (
                <span className="text-[11px] text-gray-600 font-semibold capitalize">
                    {d?.payment?.method}
                </span>
            ),
        },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-5 animate-fade-in pb-10">

            {/* â”€â”€ Top Row: Welcome Card + Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="flex 2xl:flex-row flex-col gap-5">

                {/* Welcome Card */}
                <div className="2xl:w-[380px] w-full shrink-0 bg-white rounded-xl border border-slate-100/80 shadow-sm overflow-hidden">
                    {/* Hero Banner */}
                    <div className="relative h-36 bg-gradient-to-br from-[#F97316] to-[#FB923C] overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
                        <div className="absolute top-5 left-5">
                            <p className="text-white/70 text-[11px] font-bold tracking-widest uppercase">Admin Portal</p>
                            <h2 className="text-white text-xl font-extrabold mt-1 leading-tight">Welcome Back! ðŸ‘‹</h2>
                            <p className="text-white/80 text-[12px] font-medium mt-1">GymStick Dashboard</p>
                        </div>
                        <Image
                            alt="admin banner"
                            src="/admin_profile.png"
                            className="absolute bottom-0 right-0 h-[130px] w-[200px] object-cover opacity-90"
                            width={200}
                            height={130}
                        />
                    </div>

                    {/* Profile Area */}
                    <div className="px-5 pt-4 pb-5">
                        <div className="flex items-center gap-4">
                            <div className="relative -mt-10">
                                {user?.image ? (
                                    <Image src={user?.image} alt="admin avatar" width={56} height={56}
                                        className="w-14 h-14 rounded-xl border-4 border-white shadow-md object-cover" />
                                ) : (
                                    <div className="w-14 h-14 rounded-xl border-4 border-white shadow-md bg-gradient-to-br from-[#F97316] to-[#FB923C] flex items-center justify-center text-white text-lg font-black">
                                        {userInitials}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 pt-1">
                                <p className="text-[14px] font-extrabold text-gray-800 leading-tight">{user?.name}</p>
                                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest capitalize">{user?.role}</p>
                            </div>
                            <Link
                                href="/admin/profile"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F97316] text-white text-[11px] font-bold hover:bg-[#EA580C] transition-colors shadow-md shadow-[#F97316]/25 shrink-0"
                            >
                                Profile <FiArrowRight size={12} />
                            </Link>
                        </div>

                        {/* Quick stat row */}
                        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100">
                            {[
                                { label: 'Members', value: data?.totalUsers ?? 0 },
                                { label: 'Orders', value: data?.totalOrders ?? 0 },
                                { label: 'Trainers', value: data?.totalTrainers ?? 0 },
                            ].map(({ label, value }) => (
                                <div key={label} className="text-center">
                                    <p className="text-base font-extrabold text-gray-800">{value.toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-400 font-semibold">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid w-full xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                    {statCards.map((card) => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>
            </div>

            {/* â”€â”€ Charts Row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="flex xl:flex-row flex-col gap-5">
                <div className="xl:flex-[3] bg-white rounded-xl border border-slate-100/80 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                            <FiTrendingUp size={15} />
                        </div>
                        <h3 className="text-sm font-extrabold text-gray-800">Monthly Revenue</h3>
                    </div>
                    <MonthlyEarningsChart data={data?.monthlyEarnings} />
                </div>

                <div className="xl:flex-[2] bg-white rounded-xl border border-slate-100/80 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                            <FiShoppingCart size={15} />
                        </div>
                        <h3 className="text-sm font-extrabold text-gray-800">Sales Analytics</h3>
                    </div>
                    <DonutChart data={data?.salesData} />
                </div>
            </div>

            {/* â”€â”€ Quick Lists Row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="grid 2xl:grid-cols-3 xl:grid-cols-2 grid-cols-1 gap-5">

                {/* Top Products */}
                <div className="bg-white rounded-xl border border-slate-100/80 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                        <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                            <FiBox size={14} />
                        </div>
                        <h3 className="text-[13px] font-extrabold text-gray-800">Top Selling Products</h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {data?.topProducts?.map((product, index) => (
                            <div key={product._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                                    <Image alt="product" src={product?.thumbnail_image} className="object-cover w-full h-full" height={40} width={40} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/admin/product/view/${product?._id}`} className="text-[12px] font-bold text-gray-800 hover:text-[#F97316] transition-colors line-clamp-1">
                                        {columnFormatter(product?.name)}
                                    </Link>
                                    <p className="text-[11px] text-emerald-600 font-bold">${product?.price}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[13px] font-extrabold text-gray-800">{product?.totalSold}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">sold</p>
                                </div>
                            </div>
                        ))}
                        {!data?.topProducts?.length && (
                            <div className="px-5 py-8 text-center text-gray-400 text-xs font-medium">No data yet</div>
                        )}
                    </div>
                </div>

                {/* Top Trainers */}
                <div className="bg-white rounded-xl border border-slate-100/80 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <FaDumbbell size={13} />
                        </div>
                        <h3 className="text-[13px] font-extrabold text-gray-800">Top Trainers</h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {data?.topTrainers?.map((trainer, index) => {
                            const trainerInitials = trainer?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                            return (
                                <div key={trainer._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                                        {trainer?.image ? (
                                            <Image src={trainer?.image} alt="trainer" className="object-cover w-full h-full" height={40} width={40} />
                                        ) : (
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-black">
                                                {trainerInitials}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-bold text-gray-800 line-clamp-1">{trainer?.name}</p>
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide capitalize">{trainer?.role}</p>
                                    </div>
                                    <Link href="/admin/trainers"
                                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-[#F97316]/5 text-[#F97316] hover:bg-[#F97316] hover:text-white transition-all shrink-0">
                                        <FiEye size={11} /> View
                                    </Link>
                                </div>
                            );
                        })}
                        {!data?.topTrainers?.length && (
                            <div className="px-5 py-8 text-center text-gray-400 text-xs font-medium">No trainers yet</div>
                        )}
                    </div>
                </div>

                {/* Active Members */}
                <div className="bg-white rounded-xl border border-slate-100/80 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                        <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                            <FiUsers size={14} />
                        </div>
                        <h3 className="text-[13px] font-extrabold text-gray-800">Active Members</h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {data?.activeMembers?.map((member, index) => {
                            const memberInitials = member?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                            return (
                                <div key={index} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                                        {member?.image ? (
                                            <Image src={member?.image} alt="member" className="object-cover w-full h-full" height={40} width={40} />
                                        ) : (
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#FB923C] flex items-center justify-center text-white text-xs font-black">
                                                {memberInitials}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-bold text-gray-800 line-clamp-1">{member?.name}</p>
                                        <p className="text-[10px] text-[#F97316] font-bold uppercase tracking-wide">Member</p>
                                    </div>
                                    <Link href={`/admin/users/view/${member?._id}`}
                                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-[#F97316]/5 text-[#F97316] hover:bg-[#F97316] hover:text-white transition-all shrink-0">
                                        <FiEye size={11} /> View
                                    </Link>
                                </div>
                            );
                        })}
                        {!data?.activeMembers?.length && (
                            <div className="px-5 py-8 text-center text-gray-400 text-xs font-medium">No active members</div>
                        )}
                    </div>
                </div>
            </div>

            {/* â”€â”€ Latest Transactions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="bg-white rounded-xl border border-slate-100/80 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                    <div className="w-7 h-7 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center shrink-0">
                        <FiShoppingCart size={14} />
                    </div>
                    <h3 className="text-[13px] font-extrabold text-gray-800">Latest Transactions</h3>
                </div>
                <Table
                    columns={columns}
                    data={data?.latestOrders}
                    indexed
                    shadow={false}
                    onView={(value) => router.push(`/admin/order/view/${value?._id}`)}
                />
            </div>
        </div>
    );
};

export default page;

