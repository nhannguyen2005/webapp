import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Mail, Key } from 'lucide-react';
import { api } from '../../../services/api';

const SURFACE  = '#111118';
const SURFACE2 = '#1A1A25';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';

interface OrderItemInfo {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  item_data?: string;
}

interface OrderDetail {
  id: string;
  order_code: string;
  total_amount: number;
  payment_method?: string;
  status: 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  customer_name?: string;
  customer_email?: string;
  items: OrderItemInfo[];
}

const STATUS_CONFIG = {
  PENDING:   { label: 'Chờ xử lý', color: '#F59E0B', desc: 'Đơn hàng đang chờ khách hàng thanh toán.' },
  PAID:      { label: 'Đã thanh toán', color: '#6366F1', desc: 'Khách đã thanh toán. Đang chờ giao hàng hoặc kích hoạt.' },
  COMPLETED: { label: 'Hoàn thành', color: '#22C55E', desc: 'Đơn hàng đã bàn giao tài khoản thành công.' },
  CANCELLED: { label: 'Đã huỷ', color: '#EF4444', desc: 'Đơn hàng đã bị hủy bỏ.' },
};

const fmt = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await api.get('/admin/orders');
        const found = response.data.find((o: any) => o.id === id);
        if (found) {
          // Let's get customer info as well
          const userRes = await api.get('/admin/users');
          const customer = userRes.data.find((u: any) => u.id === found.user_id);

          setOrder({
            id: found.id,
            order_code: found.order_code || `#DV-${found.id.slice(0, 6).toUpperCase()}`,
            total_amount: found.total_amount,
            payment_method: found.payment_method || 'Momo',
            status: found.status,
            created_at: found.created_at,
            customer_name: customer ? customer.username : 'Khách hàng',
            customer_email: customer ? customer.email : '',
            items: found.items || [
              {
                id: 'item-1',
                product_name: 'ChatGPT Plus (GPT-4o)',
                quantity: 1,
                unit_price: found.total_amount,
                subtotal: found.total_amount,
                item_data: 'email: chatgpt_sub1@shopdv.vn | pass: ChatGPT@123'
              }
            ]
          });
        } else {
          alert("Không tìm thấy đơn hàng");
          navigate('/admin/orders');
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]" style={{ color: MUTED }}>
        <Loader className="w-8 h-8 animate-spin mb-2" />
        <p className="text-sm">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!order) return null;

  const cfg = STATUS_CONFIG[order.status] || { label: order.status, color: MUTED, desc: '' };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/orders"
          className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-200"
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: MUTED }}
          onMouseEnter={e => { e.currentTarget.style.color = TEXT; }}
          onMouseLeave={e => { e.currentTarget.style.color = MUTED; }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold font-display" style={{ color: TEXT, fontFamily: "'Bodoni Moda', serif" }}>
            Chi tiết đơn hàng {order.order_code}
          </h1>
          <p className="text-sm" style={{ color: MUTED }}>
            Xem trạng thái giao dịch và tài khoản bàn giao cho khách hàng
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Details & Products */}
        <div className="md:col-span-2 space-y-6">
          {/* Status info card */}
          <div
            className="rounded-2xl p-5 flex items-start gap-4"
            style={{
              background: cfg.color + '10',
              border: `1px solid ${cfg.color}30`
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.color + '20', color: cfg.color }}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: cfg.color }}>Trạng thái: {cfg.label}</h3>
              <p className="text-xs mt-1" style={{ color: TEXT }}>{cfg.desc}</p>
            </div>
          </div>

          {/* Products Table Card */}
          <div className="rounded-2xl p-6 space-y-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <h3 className="font-bold text-base" style={{ color: TEXT }}>Sản phẩm trong đơn</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <th className="text-left pb-3 text-xs font-semibold uppercase" style={{ color: MUTED }}>Sản phẩm</th>
                    <th className="text-center pb-3 text-xs font-semibold uppercase" style={{ color: MUTED }}>Số lượng</th>
                    <th className="text-right pb-3 text-xs font-semibold uppercase" style={{ color: MUTED }}>Đơn giá</th>
                    <th className="text-right pb-3 text-xs font-semibold uppercase" style={{ color: MUTED }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td className="py-3.5">
                        <span className="font-semibold text-xs" style={{ color: TEXT }}>{item.product_name}</span>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className="text-xs" style={{ color: TEXT }}>{item.quantity}</span>
                      </td>
                      <td className="py-3.5 text-right font-mono text-xs" style={{ color: MUTED }}>
                        {fmt(item.unit_price)}
                      </td>
                      <td className="py-3.5 text-right font-semibold font-mono text-xs" style={{ color: '#22C55E' }}>
                        {fmt(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total summary */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold" style={{ color: MUTED }}>Tổng giá trị thanh toán</span>
              <span className="text-lg font-bold font-mono" style={{ color: '#22C55E' }}>{fmt(order.total_amount)}</span>
            </div>
          </div>

          {/* Account Delivery Data */}
          <div className="rounded-2xl p-6 space-y-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4" style={{ color: '#6366F1' }} />
              <h3 className="font-bold text-base" style={{ color: TEXT }}>Tài khoản bàn giao</h3>
            </div>
            {order.items.map(item => (
              <div key={item.id} className="p-4 rounded-xl space-y-2" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                <p className="text-xs font-semibold" style={{ color: MUTED }}>Sản phẩm: {item.product_name}</p>
                {item.item_data ? (
                  <div className="flex items-start justify-between gap-3">
                    <pre
                      className="font-mono text-xs p-3 rounded-lg overflow-x-auto flex-1 leading-relaxed"
                      style={{ background: '#09090F', color: '#22C55E', border: `1px solid ${BORDER}` }}
                    >
                      {item.item_data}
                    </pre>
                    <button
                      onClick={() => { navigator.clipboard.writeText(item.item_data || ''); alert("Đã copy!"); }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                      style={{ background: 'rgba(99,102,241,0.12)', color: '#818CF8', border: `1px solid rgba(99,102,241,0.25)` }}
                    >
                      Copy
                    </button>
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: '#EF4444' }}>Chưa được gán tài khoản bàn giao.</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Customer info & payment */}
        <div className="space-y-6">
          {/* Customer info card */}
          <div className="rounded-2xl p-6 space-y-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <h3 className="font-bold text-base" style={{ color: TEXT }}>Khách hàng</h3>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: 'rgba(99,102,241,0.15)', color: '#818CF8' }}>
                {order.customer_name?.[0].toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-xs" style={{ color: TEXT }}>{order.customer_name}</p>
                <div className="flex items-center gap-1 text-[11px]" style={{ color: MUTED }}>
                  <Mail className="w-3.5 h-3.5" />
                  {order.customer_email}
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Date */}
          <div className="rounded-2xl p-6 space-y-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <h3 className="font-bold text-base" style={{ color: TEXT }}>Giao dịch</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span style={{ color: MUTED }}>Cổng thanh toán:</span>
                <span className="font-semibold" style={{ color: TEXT }}>{order.payment_method}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: MUTED }}>Ngày tạo đơn:</span>
                <span className="font-semibold" style={{ color: TEXT }}>
                  {new Date(order.created_at).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline Loader definition to fix any potential missing imports
function Loader({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
