import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from 'recharts';

const SURFACE  = '#111118';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';
const GRID     = 'rgba(255,255,255,0.05)';

/* ── Revenue Area Chart ────────────────────────────────────────── */
const REVENUE_DATA = [
  { name: '1/7', revenue: 4200000, orders: 12 },
  { name: '2/7', revenue: 6800000, orders: 19 },
  { name: '3/7', revenue: 5100000, orders: 15 },
  { name: '4/7', revenue: 8900000, orders: 28 },
  { name: '5/7', revenue: 7200000, orders: 22 },
  { name: '6/7', revenue: 11400000, orders: 35 },
  { name: '7/7', revenue: 9600000, orders: 30 },
  { name: '8/7', revenue: 13200000, orders: 41 },
  { name: '9/7', revenue: 10800000, orders: 33 },
  { name: '10/7', revenue: 15600000, orders: 48 },
  { name: '11/7', revenue: 12900000, orders: 39 },
  { name: '12/7', revenue: 17400000, orders: 54 },
  { name: '13/7', revenue: 14100000, orders: 43 },
  { name: '14/7', revenue: 19800000, orders: 61 },
];

const fmt = (v: number) =>
  v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}K`;

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-4 py-3 rounded-xl text-sm"
      style={{ background: '#1E2030', border: '1px solid rgba(255,255,255,0.1)', color: TEXT }}
    >
      <p className="font-semibold mb-2" style={{ color: MUTED }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: MUTED }}>{p.name}:</span>
          <span className="font-bold" style={{ color: TEXT }}>
            {p.name === 'Doanh thu'
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.value)
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart() {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-base" style={{ color: TEXT }}>Doanh thu 14 ngày</h3>
          <p className="text-xs mt-0.5" style={{ color: MUTED }}>So sánh với kỳ trước</p>
        </div>
        <div
          className="text-xs px-3 py-1.5 rounded-full font-medium"
          style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
        >
          +24.8%
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: MUTED, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fill: MUTED, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Doanh thu"
            stroke="#6366F1"
            strokeWidth={2}
            fill="url(#revenueGrad)"
            dot={false}
            activeDot={{ r: 5, fill: '#6366F1', stroke: '#1E2030', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Orders Bar Chart ──────────────────────────────────────────── */
const ORDER_DATA = [
  { name: 'T2', completed: 18, pending: 4, cancelled: 1 },
  { name: 'T3', completed: 24, pending: 6, cancelled: 2 },
  { name: 'T4', completed: 31, pending: 8, cancelled: 3 },
  { name: 'T5', completed: 22, pending: 5, cancelled: 1 },
  { name: 'T6', completed: 39, pending: 9, cancelled: 4 },
  { name: 'T7', completed: 45, pending: 11, cancelled: 2 },
  { name: 'CN', completed: 28, pending: 7, cancelled: 1 },
];

export function OrdersChart() {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-base" style={{ color: TEXT }}>Đơn hàng tuần này</h3>
          <p className="text-xs mt-0.5" style={{ color: MUTED }}>Phân loại theo trạng thái</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={ORDER_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="name" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
          <Tooltip
            contentStyle={{
              background: '#1E2030',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: TEXT,
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: MUTED, paddingTop: 12 }}
          />
          <Bar dataKey="completed" name="Hoàn thành" fill="#22C55E" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pending" name="Chờ xử lý" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          <Bar dataKey="cancelled" name="Đã huỷ" fill="#EF4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
