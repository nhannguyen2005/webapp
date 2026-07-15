import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ChevronLeft, ChevronRight, Eye,
  Clock, CheckCircle, XCircle, Loader, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';

const SURFACE  = '#111118';
const SURFACE2 = '#1A1A25';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';

const fmt = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

interface Order {
  id: string;
  order_code: string;
  customer_name?: string;
  customer_email?: string;
  product_name?: string;
  total_amount: number;
  payment_method?: string;
  status: 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
}

const STATUS_CONFIG = {
  PENDING:   { label: 'Chờ xử lý', color: '#F59E0B', Icon: Clock },
  PAID:      { label: 'Đã thanh toán', color: '#6366F1', Icon: CheckCircle },
  COMPLETED: { label: 'Hoàn thành', color: '#22C55E', Icon: CheckCircle },
  CANCELLED: { label: 'Đã huỷ', color: '#EF4444', Icon: XCircle },
} as const;

const PAGE_SIZE = 10;

export default function OrdersListPage() {
  const [orders, setProducts] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [page, setPage] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/orders');
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/admin/orders/${id}/status`, null, {
        params: { status_in: newStatus }
      });
      setProducts(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
      alert("Cập nhật đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      alert("Cập nhật thất bại.");
    }
  };

  const filtered = orders.filter(o => {
    const code = o.order_code || `#DV-${o.id.slice(0,6)}`;
    const matchSearch = code.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'Tất cả' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: TEXT, fontFamily: "'Bodoni Moda', serif" }}>
            Quản lý đơn hàng
          </h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>{total} đơn hàng</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: MUTED }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm mã đơn, tên..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
            style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['Tất cả', 'PENDING', 'PAID', 'COMPLETED', 'CANCELLED'].map(s => {
            const cfg = STATUS_CONFIG[s as keyof typeof STATUS_CONFIG];
            return (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className="px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200"
                style={{
                  background: statusFilter === s ? (cfg ? cfg.color + '18' : 'rgba(99,102,241,0.15)') : SURFACE,
                  border: `1px solid ${statusFilter === s ? (cfg ? cfg.color + '40' : 'rgba(99,102,241,0.4)') : BORDER}`,
                  color: statusFilter === s ? (cfg ? cfg.color : '#818CF8') : MUTED,
                }}
              >
                {cfg ? cfg.label : s}
              </button>
            );
          })}
        </div>
        <button
          onClick={fetchOrders}
          className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ml-auto"
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: MUTED }}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Mã đơn', 'Khách hàng', 'Số tiền', 'Phương thức', 'Trạng thái', 'Thay đổi trạng thái', 'Thời gian', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-10" style={{ color: MUTED }}>
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" /> Đang tải đơn hàng...
                    </div>
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10" style={{ color: MUTED }}>
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              ) : (
                paged.map((order, i) => {
                  const orderCode = order.order_code || `#DV-${order.id.slice(0, 6).toUpperCase()}`;
                  const cfg = STATUS_CONFIG[order.status] || { label: order.status, color: MUTED, Icon: Clock };
                  const { label, color, Icon } = cfg;
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      style={{ borderBottom: i < paged.length - 1 ? `1px solid ${BORDER}` : 'none' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = SURFACE2; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-bold" style={{ color: '#6366F1' }}>{orderCode}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-xs" style={{ color: TEXT }}>{order.customer_name || 'Khách hàng'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold font-mono text-xs" style={{ color: '#22C55E' }}>{fmt(order.total_amount)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: MUTED }}>
                          {order.payment_method || 'Chuyển khoản'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold animate-none" style={{ background: color + '18', color }}>
                          <Icon className="w-3 h-3" />
                          {label}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          onChange={e => handleUpdateStatus(order.id, e.target.value)}
                          className="px-2 py-1 rounded-lg text-xs outline-none cursor-pointer"
                          style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
                        >
                          <option value="PENDING">Chờ xử lý</option>
                          <option value="PAID">Đã thanh toán</option>
                          <option value="COMPLETED">Hoàn thành</option>
                          <option value="CANCELLED">Đã huỷ</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs" style={{ color: MUTED }}>
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
                          style={{ color: MUTED }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.12)'; (e.currentTarget as HTMLElement).style.color = '#818CF8'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = MUTED; }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: `1px solid ${BORDER}` }}>
            <p className="text-xs" style={{ color: MUTED }}>
              Hiển thị {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} / {total}
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all disabled:opacity-30"
                style={{ background: SURFACE2, color: MUTED }}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i + 1} onClick={() => setPage(i + 1)}
                  className="w-8 h-8 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                  style={{ background: page === i + 1 ? '#6366F1' : SURFACE2, color: page === i + 1 ? '#fff' : MUTED }}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all disabled:opacity-30"
                style={{ background: SURFACE2, color: MUTED }}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
