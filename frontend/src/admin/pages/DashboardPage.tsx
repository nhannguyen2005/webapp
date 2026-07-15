import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, ShoppingCart, Users, Package,
  Clock, CheckCircle, AlertTriangle, RefreshCw,
  TrendingUp
} from 'lucide-react';
import StatsCard from '../components/ui/StatsCard';
import { RevenueChart, OrdersChart } from '../components/charts/AdminCharts';
import RecentOrdersTable from '../components/ui/RecentOrdersTable';
import { api } from '../../services/api';

const TEXT  = '#F1F5F9';
const MUTED = '#64748B';
const SURFACE  = '#111118';
const BORDER   = 'rgba(255,255,255,0.07)';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Real data state
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    total_products: 0,
    total_users: 0,
    pending_orders: 0,
    today_revenue: 0,
    today_orders: 0,
    recent_orders: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Lỗi khi tải dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fmtCurrency = (v: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  const statsCardsConfig = [
    {
      title: 'Doanh thu',
      value: fmtCurrency(stats.total_revenue),
      subtitle: 'Toàn thời gian',
      icon: <DollarSign className="w-4 h-4" />,
      trend: 28,
      trendLabel: 'so với hôm qua',
      accentColor: '#22C55E',
    },
    {
      title: 'Đơn hàng mới',
      value: stats.total_orders.toString(),
      subtitle: `Hôm nay: ${stats.today_orders} đơn`,
      icon: <ShoppingCart className="w-4 h-4" />,
      trend: 12,
      trendLabel: 'so với hôm qua',
      accentColor: '#6366F1',
    },
    {
      title: 'Khách hàng',
      value: stats.total_users.toString(),
      subtitle: 'Đang hoạt động',
      icon: <Users className="w-4 h-4" />,
      trend: 8,
      trendLabel: 'so với tháng trước',
      accentColor: '#0EA5E9',
    },
    {
      title: 'Sản phẩm',
      value: stats.total_products.toString(),
      subtitle: 'Danh mục đa dạng',
      icon: <Package className="w-4 h-4" />,
      trend: 3,
      trendLabel: 'tăng trưởng',
      accentColor: '#F59E0B',
    },
  ];

  const quickSummaryConfig = [
    { label: 'Chờ xử lý', value: stats.pending_orders, color: '#F59E0B', icon: <Clock className="w-4 h-4" /> },
    { label: 'Hoàn thành', value: stats.total_orders - stats.pending_orders, color: '#22C55E', icon: <CheckCircle className="w-4 h-4" /> },
    { label: 'Doanh thu hôm nay', value: fmtCurrency(stats.today_revenue), color: '#6366F1', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Đơn cần xử lý gấp', value: stats.pending_orders, color: '#EF4444', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: TEXT, fontFamily: "'Bodoni Moda', serif" }}>
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            Cập nhật lần cuối: {lastUpdated.toLocaleTimeString('vi-VN')}
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 disabled:opacity-50"
          style={{
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#818CF8',
          }}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Quick summary strip */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl"
        style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
      >
        {quickSummaryConfig.map(q => (
          <div key={q.label} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: q.color + '18', color: q.color }}
            >
              {q.icon}
            </div>
            <div>
              <p
                className="font-bold text-base md:text-lg leading-none font-mono"
                style={{ color: TEXT, fontFamily: "'Fira Code', monospace" }}
              >
                {q.value}
              </p>
              <p className="text-[10px] md:text-[11px] mt-0.5" style={{ color: MUTED }}>{q.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {statsCardsConfig.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <StatsCard {...s} loading={loading} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row */}
      <motion.div
        className="grid grid-cols-1 xl:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <OrdersChart />
        </div>
      </motion.div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <RecentOrdersTable orders={stats.recent_orders} />
      </motion.div>
    </div>
  );
}
