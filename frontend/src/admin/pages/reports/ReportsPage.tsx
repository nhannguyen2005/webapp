import React from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { RevenueChart, OrdersChart } from '../../components/charts/AdminCharts';

const SURFACE  = '#111118';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';

const fmt = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const BEST_SELLERS = [
  { name: 'ChatGPT Plus (GPT-4o)', qty: 142, revenue: 22578000 },
  { name: 'Netflix Premium 4K', qty: 98, revenue: 5782000 },
  { name: 'Canva Pro 1 năm', qty: 86, revenue: 8514000 },
  { name: 'Spotify Premium', qty: 74, revenue: 2146000 },
  { name: 'Cursor AI Pro', qty: 41, revenue: 12259000 },
];

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5" style={{ color: '#6366F1' }} />
        <div>
          <h1 className="text-xl font-bold font-display" style={{ color: TEXT, fontFamily: "'Bodoni Moda', serif" }}>
            Thống kê & Báo cáo doanh số
          </h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            Phân tích số liệu tài chính, hiệu suất bán hàng và sản phẩm phổ biến
          </p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Doanh thu thuần', value: fmt(48972000), desc: 'Tăng 14.2% so với tháng trước', icon: <DollarSign className="w-4 h-4" />, color: '#22C55E' },
          { title: 'Lợi nhuận gộp', value: fmt(24586000), desc: 'Biên lợi nhuận gộp ~50.2%', icon: <TrendingUp className="w-4 h-4" />, color: '#6366F1' },
          { title: 'Sản lượng đã bán', value: '441 sản phẩm', desc: 'Trung bình 15 sản phẩm/ngày', icon: <ShoppingBag className="w-4 h-4" />, color: '#0EA5E9' },
        ].map(s => (
          <div key={s.title} className="rounded-2xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs" style={{ color: MUTED }}>{s.title}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.color + '18', color: s.color }}>
                {s.icon}
              </div>
            </div>
            <p className="text-xl font-bold font-mono" style={{ color: TEXT }}>{s.value}</p>
            <p className="text-[11px] mt-1" style={{ color: MUTED }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OrdersChart />
      </div>

      {/* Best Sellers */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
        <h3 className="font-bold text-sm" style={{ color: TEXT }}>Sản phẩm bán chạy nhất</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }} className="text-xs">
                <th className="text-left pb-3 font-semibold uppercase" style={{ color: MUTED }}>Tên sản phẩm</th>
                <th className="text-center pb-3 font-semibold uppercase" style={{ color: MUTED }}>Số lượng bán</th>
                <th className="text-right pb-3 font-semibold uppercase" style={{ color: MUTED }}>Tổng doanh thu</th>
                <th className="text-right pb-3 font-semibold uppercase" style={{ color: MUTED }}>Hiệu suất</th>
              </tr>
            </thead>
            <tbody>
              {BEST_SELLERS.map((item, i) => (
                <tr key={item.name} style={{ borderBottom: i < BEST_SELLERS.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  <td className="py-3 text-xs font-semibold" style={{ color: TEXT }}>{item.name}</td>
                  <td className="py-3 text-center text-xs font-semibold" style={{ color: TEXT }}>{item.qty}</td>
                  <td className="py-3 text-right font-semibold font-mono text-xs" style={{ color: '#22C55E' }}>{fmt(item.revenue)}</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-green-400">
                      <ArrowUpRight className="w-3 h-3" />
                      +{25 - i * 4}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
