import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';

const SURFACE  = '#111118';
const SURFACE2 = '#1A1A25';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';

export interface RecentOrder {
  id: string;
  code: string;
  customer: string;
  amount: number;
  status: string;
  created_at: string;
}

interface RecentOrdersTableProps {
  orders?: RecentOrder[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; Icon: React.ComponentType<any> }> = {
  COMPLETED: { label: 'Hoàn thành', color: '#22C55E', Icon: CheckCircle },
  PAID:      { label: 'Đã thanh toán', color: '#6366F1', Icon: CheckCircle },
  PENDING:   { label: 'Chờ xử lý', color: '#F59E0B', Icon: Loader },
  CANCELLED: { label: 'Đã huỷ', color: '#EF4444', Icon: XCircle },
};

const fmt = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

export default function RecentOrdersTable({ orders = [] }: RecentOrdersTableProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <div>
          <h3 className="font-semibold text-base" style={{ color: TEXT }}>Đơn hàng gần đây</h3>
          <p className="text-xs mt-0.5" style={{ color: MUTED }}>Các đơn hàng mới nhất từ hệ thống</p>
        </div>
        <Link
          to="/admin/orders"
          className="flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors duration-200 hover:text-indigo-400"
          style={{ color: '#6366F1' }}
        >
          Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Mã đơn', 'Khách hàng', 'Số tiền', 'Trạng thái', 'Thời gian'].map(h => (
                <th
                  key={h}
                  className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: MUTED }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8" style={{ color: MUTED }}>
                  Chưa có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((order, i) => {
                const statusKey = order.status?.toUpperCase() || 'PENDING';
                const cfg = STATUS_CONFIG[statusKey] || { label: order.status, color: MUTED, Icon: Clock };
                const { label, color, Icon } = cfg;
                return (
                  <tr
                    key={order.id}
                    className="transition-colors duration-150"
                    style={{
                      borderBottom: i < orders.length - 1 ? `1px solid ${BORDER}` : 'none',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = SURFACE2; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                  >
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-xs font-medium" style={{ color: '#6366F1' }}>
                        {order.code}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-medium" style={{ color: TEXT }}>{order.customer}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-semibold font-mono" style={{ color: '#22C55E' }}>
                        {fmt(order.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{ background: color + '18', color }}
                      >
                        <Icon className="w-3 h-3 animate-none" />
                        {label}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1.5" style={{ color: MUTED }}>
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">
                          {new Date(order.created_at).toLocaleTimeString('vi-VN')} {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
