import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, CreditCard, Key, ShoppingBag, Gift,
  MessageSquare, LogOut, Save, Plus, Copy,
  Loader, AlertCircle, CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { api } from '../services/api';
import AnimatedPage from '../components/layout/AnimatedPage';

const BACKGROUND = '#0C0A09';
const SURFACE = '#1C1917';
const SURFACE2 = '#292524';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT = '#F5F5F4';
const MUTED = '#A8A29E';
const GOLD = '#CA8A04';
const GOLD_LIGHT = '#FBBF24';

const fmt = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

export default function UserPortalPage() {
  const { user, logout, setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'library' | 'orders' | 'wallet' | 'referral' | 'support'>('profile');

  // Shared balance state to keep UI updated
  const [balance, setBalance] = useState(0);

  // Fetch updated user info to get latest balance
  const refreshUser = async () => {
    try {
      const response = await api.get('/portal/me');
      setBalance(Number(response.data.balance || 0));
      // Sync store
      if (user) {
        setAuth(
          {
            ...user,
            balance: response.data.balance
          } as any,
          localStorage.getItem('access_token') || '',
          localStorage.getItem('refresh_token') || ''
        );
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin user:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      refreshUser();
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Tài khoản', icon: <User className="w-4 h-4" /> },
    { id: 'library', label: 'Thư viện số', icon: <Key className="w-4 h-4" /> },
    { id: 'orders', label: 'Đơn hàng', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'wallet', label: 'Ví & Nạp tiền', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'referral', label: 'Giới thiệu', icon: <Gift className="w-4 h-4" /> },
    { id: 'support', label: 'Hỗ trợ kỹ thuật', icon: <MessageSquare className="w-4 h-4" /> },
  ] as const;

  return (
    <AnimatedPage className="min-h-[85vh] py-12" style={{ background: BACKGROUND }}>
      <div className="container-custom max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Side: User Info & Tab Navigation */}
        <div className="space-y-6">
          <div
            className="rounded-3xl p-6 text-center space-y-4"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center font-bold text-2xl"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                color: '#1C1917'
              }}
            >
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="font-bold text-base" style={{ color: TEXT }}>
                {user?.username}
              </h2>
              <p className="text-xs" style={{ color: MUTED }}>
                {user?.email}
              </p>
            </div>

            {/* Wallet balance display */}
            <div className="pt-2 border-t" style={{ borderColor: BORDER }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Số dư ví</p>
              <p className="text-lg font-bold font-mono mt-0.5" style={{ color: GOLD_LIGHT }}>
                {fmt(balance)}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div
            className="rounded-3xl p-3 flex flex-col gap-1"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold cursor-pointer transition-all duration-200"
                style={{
                  background: activeTab === tab.id ? 'rgba(202,138,4,0.08)' : 'transparent',
                  color: activeTab === tab.id ? GOLD_LIGHT : MUTED,
                  border: `1px solid ${activeTab === tab.id ? 'rgba(202,138,4,0.15)' : 'transparent'}`
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold cursor-pointer transition-all duration-200 mt-4 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Right Side: Panels Content */}
        <div className="md:col-span-3">
          <div
            className="rounded-3xl p-6 sm:p-8 min-h-[60vh]"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <ProfileSection key="profile" user={user} onProfileUpdated={refreshUser} />
              )}
              {activeTab === 'library' && (
                <LibrarySection key="library" />
              )}
              {activeTab === 'orders' && (
                <OrdersHistorySection key="orders" />
              )}
              {activeTab === 'wallet' && (
                <WalletSection key="wallet" balance={balance} />
              )}
              {activeTab === 'referral' && (
                <ReferralSection key="referral" username={user?.username || ''} />
              )}
              {activeTab === 'support' && (
                <SupportSection key="support" />
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </AnimatedPage>
  );
}

/* ────────────────────────────────────────────────────────────────
   1. Profile Section
   ──────────────────────────────────────────────────────────────── */
function ProfileSection({ user, onProfileUpdated }: { user: any; onProfileUpdated: () => void }) {
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', isError: false });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', isError: false });

    try {
      await api.put('/portal/me', { username, email });
      setMsg({ text: 'Cập nhật hồ sơ cá nhân thành công!', isError: false });
      onProfileUpdated();
    } catch (err: any) {
      console.error(err);
      setMsg({
        text: err.response?.data?.detail || 'Cập nhật thất bại. Vui lòng kiểm tra lại.',
        isError: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold font-display" style={{ fontFamily: "'Bodoni Moda', serif", color: TEXT }}>
          Thông tin tài khoản
        </h3>
        <p className="text-xs" style={{ color: MUTED }}>Cập nhật tên hiển thị hoặc thay đổi email liên lạc</p>
      </div>

      {msg.text && (
        <div
          className="flex items-center gap-2.5 p-3.5 rounded-xl text-xs font-semibold border animate-fade-in"
          style={{
            background: msg.isError ? 'rgba(239, 68, 68, 0.07)' : 'rgba(34, 197, 94, 0.07)',
            borderColor: msg.isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
            color: msg.isError ? '#F87171' : '#4ADE80'
          }}
        >
          {msg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#E7E5E4' }}>Tên hiển thị</label>
          <input
            type="text"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-xs outline-none"
            style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: '#fff' }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#E7E5E4' }}>Địa chỉ Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-xs outline-none"
            style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: '#fff' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: BACKGROUND }}
        >
          {loading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Lưu thay đổi
        </button>
      </form>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   2. Digital Library Section
   ──────────────────────────────────────────────────────────────── */
function LibrarySection() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Extract items that are accounts/keys from completed orders
  const items = orders
    .filter(o => o.status === 'COMPLETED' || o.status === 'PAID')
    .flatMap(o => (o.items || []).map((item: any) => ({ ...item, order_code: o.order_code, date: o.created_at })));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold font-display" style={{ fontFamily: "'Bodoni Moda', serif", color: TEXT }}>
          Thư viện sản phẩm số
        </h3>
        <p className="text-xs" style={{ color: MUTED }}>Nơi lưu trữ các tài khoản và license key đã mua tự động</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs py-8" style={{ color: MUTED }}>
          <Loader className="w-4 h-4 animate-spin" /> Đang tải kho thư viện...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={{ border: `1px dashed ${BORDER}` }}>
          <p className="text-sm" style={{ color: MUTED }}>Thư viện trống. Hãy thực hiện mua hàng để nhận sản phẩm số.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="rounded-2xl p-5 space-y-3"
              style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-bold text-xs" style={{ color: TEXT }}>{item.product_name}</h4>
                  <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>
                    Đơn hàng: <span className="font-mono text-indigo-400">{item.order_code}</span> · {new Date(item.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase" style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
                  Giao hàng tự động
                </span>
              </div>

              {item.item_data ? (
                <div className="flex items-start justify-between gap-3 p-3 rounded-xl" style={{ background: '#09090F', border: `1px solid ${BORDER}` }}>
                  <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap leading-relaxed flex-1">
                    {item.item_data}
                  </pre>
                  <button
                    onClick={() => handleCopy(item.item_data, item.id || idx.toString())}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                    style={{
                      background: copiedId === (item.id || idx.toString()) ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                      color: copiedId === (item.id || idx.toString()) ? '#4ADE80' : TEXT,
                      border: `1px solid ${copiedId === (item.id || idx.toString()) ? 'rgba(34,197,94,0.25)' : BORDER}`
                    }}
                  >
                    {copiedId === (item.id || idx.toString()) ? 'Đã copy' : 'Copy'}
                  </button>
                </div>
              ) : (
                <p className="text-xs" style={{ color: '#EF4444' }}>Đang chờ hệ thống cấp tài khoản.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   3. Order History Section
   ──────────────────────────────────────────────────────────────── */
function OrdersHistorySection() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold font-display" style={{ fontFamily: "'Bodoni Moda', serif", color: TEXT }}>
          Lịch sử mua hàng
        </h3>
        <p className="text-xs" style={{ color: MUTED }}>Theo dõi trạng thái giao dịch và hóa đơn các đơn hàng của bạn</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs py-8" style={{ color: MUTED }}>
          <Loader className="w-4 h-4 animate-spin" /> Đang tải đơn hàng...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={{ border: `1px dashed ${BORDER}` }}>
          <p className="text-sm" style={{ color: MUTED }}>Bạn chưa mua đơn hàng nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isCompleted = order.status === 'COMPLETED' || order.status === 'PAID';
            return (
              <div
                key={order.id}
                className="rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">
                      {order.order_code || `#DV-${order.id.slice(0, 6).toUpperCase()}`}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase"
                      style={{
                        background: isCompleted ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                        color: isCompleted ? '#22C55E' : '#F59E0B'
                      }}
                    >
                      {isCompleted ? 'Thành công' : order.status}
                    </span>
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: MUTED }}>
                    Ngày mua: {new Date(order.created_at).toLocaleString('vi-VN')}
                  </p>
                  <p className="text-xs mt-1" style={{ color: TEXT }}>
                    Thanh toán: <span className="font-semibold uppercase">{order.payment_method || 'VÍ'}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs" style={{ color: MUTED }}>Tổng thanh toán</p>
                  <p className="text-base font-bold font-mono text-green-400 mt-0.5">
                    {fmt(order.total_amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   4. Wallet Section
   ──────────────────────────────────────────────────────────────── */
interface WalletSectionProps {
  balance: number;
}

function WalletSection({ balance }: WalletSectionProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [topupLoading, setTopupLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState(50000);
  const [depositMethod, setDepositMethod] = useState<'payos' | 'manual_bank'>('payos');
  const [depositResult, setDepositResult] = useState<any>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/portal/wallet/transactions');
      setTransactions(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleTopup = async () => {
    if (depositAmount < 10000) {
      alert("Số tiền nạp tối thiểu là 10.000đ");
      return;
    }
    setTopupLoading(true);
    setDepositResult(null);
    try {
      const response = await api.post('/payments/create-payment-link', { 
        amount: depositAmount,
        payment_method: depositMethod
      });
      
      if (depositMethod === 'payos' && response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        setDepositResult(response.data);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Lỗi khởi tạo nạp tiền");
    } finally {
      setTopupLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold font-display" style={{ fontFamily: "'Bodoni Moda', serif", color: TEXT }}>
            Ví & Lịch sử giao dịch
          </h3>
          <p className="text-xs" style={{ color: MUTED }}>Quản lý số dư, nạp tiền và kiểm tra biến động ví</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Balance Card */}
        <div
          className="rounded-2xl p-6 h-full flex flex-col justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(202,138,4,0.1), rgba(202,138,4,0.02))',
            border: '1px solid rgba(202,138,4,0.2)'
          }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Số dư khả dụng</span>
          <p className="text-3xl font-black font-mono mt-2" style={{ color: GOLD_LIGHT }}>{fmt(balance)}</p>
        </div>

        {/* Topup Form */}
        <div className="rounded-2xl p-6" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
          <h4 className="font-bold text-sm mb-4" style={{ color: TEXT }}>Nạp tiền vào ví</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: MUTED }}>Số tiền cần nạp (VNĐ)</label>
              <input 
                type="number"
                value={depositAmount}
                onChange={e => setDepositAmount(Number(e.target.value))}
                min={10000}
                step={10000}
                className="w-full px-3 py-2 rounded-xl text-sm font-mono font-bold"
                style={{ background: BACKGROUND, border: `1px solid ${BORDER}`, color: TEXT }}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: MUTED }}>Phương thức</label>
              <select
                value={depositMethod}
                onChange={e => setDepositMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-sm font-semibold"
                style={{ background: BACKGROUND, border: `1px solid ${BORDER}`, color: TEXT }}
              >
                <option value="payos">Thanh toán tự động (Mã QR)</option>
                <option value="manual_bank">Chuyển khoản thủ công</option>
              </select>
            </div>
            
            <button
              onClick={handleTopup}
              disabled={topupLoading}
              className="w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 disabled:opacity-50 mt-2"
              style={{ background: 'linear-gradient(135deg, #CA8A04, #FBBF24)', color: BACKGROUND }}
            >
              {topupLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Tiến hành nạp
            </button>
          </div>
        </div>
      </div>

      {/* Manual Deposit Info */}
      <AnimatePresence>
        {depositResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl p-6 border-l-4" style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderLeftColor: GOLD }}>
              <h4 className="font-bold text-sm mb-3" style={{ color: TEXT }}>Hướng dẫn chuyển khoản</h4>
              <p className="text-xs mb-4" style={{ color: MUTED }}>
                Vui lòng chuyển khoản đúng số tiền và nội dung bên dưới. Tiền sẽ được duyệt vào tài khoản sau khi admin xác nhận.
              </p>
              
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <div style={{ color: MUTED }}>Ngân hàng:</div>
                <div className="font-bold" style={{ color: TEXT }}>VIETINBANK</div>
                
                <div style={{ color: MUTED }}>Tên tài khoản:</div>
                <div className="font-bold" style={{ color: TEXT }}>NGUYEN TRONG NHAN</div>
                
                <div style={{ color: MUTED }}>Số tài khoản:</div>
                <div className="font-bold flex items-center justify-between" style={{ color: GOLD_LIGHT }}>
                  0349332850
                  <button onClick={() => navigator.clipboard.writeText('0349332850')} className="p-1 hover:bg-white/10 rounded">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div style={{ color: MUTED }}>Số tiền:</div>
                <div className="font-bold font-mono" style={{ color: TEXT }}>{fmt(depositResult.amount)}</div>
                
                <div style={{ color: MUTED }}>Nội dung chuyển khoản:</div>
                <div className="font-bold font-mono flex items-center justify-between" style={{ color: '#4ADE80' }}>
                  {depositResult.transfer_syntax}
                  <button onClick={() => navigator.clipboard.writeText(depositResult.transfer_syntax)} className="p-1 hover:bg-white/10 rounded text-white">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction log */}
      <div className="space-y-4">
        <h4 className="font-bold text-xs" style={{ color: TEXT }}>Lịch sử biến động ví</h4>
        {loading ? (
          <div className="flex items-center gap-2 text-xs py-6" style={{ color: MUTED }}>
            <Loader className="w-4 h-4 animate-spin" /> Đang tải giao dịch...
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-xs italic" style={{ color: MUTED }}>Chưa có phát sinh giao dịch nào.</p>
        ) : (
          <div className="space-y-2">
            {transactions.map(tx => {
              const isPlus = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="rounded-xl p-3.5 flex justify-between items-center text-xs"
                  style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}
                >
                  <div>
                    <p className="font-semibold" style={{ color: TEXT }}>{tx.description || 'Giao dịch ví'}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: MUTED }}>
                      {new Date(tx.created_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <span className="font-bold font-mono" style={{ color: isPlus ? '#4ADE80' : '#F87171' }}>
                    {isPlus ? '+' : ''}{fmt(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   5. Referral Section
   ──────────────────────────────────────────────────────────────── */
function ReferralSection({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);
  const refLink = `${window.location.origin}/register?ref=${username.toLowerCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold font-display" style={{ fontFamily: "'Bodoni Moda', serif", color: TEXT }}>
          Giới thiệu bạn bè & Hoa hồng
        </h3>
        <p className="text-xs" style={{ color: MUTED }}>Chia sẻ liên kết giới thiệu để nhận 10% hoa hồng trên mỗi đơn hàng mới</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4 text-center" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Số lượt mời</p>
          <p className="text-lg font-bold mt-1" style={{ color: TEXT }}>0 bạn bè</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Đã tích luỹ</p>
          <p className="text-lg font-bold font-mono mt-1 text-green-400">{fmt(0)}</p>
        </div>
      </div>

      {/* Link box */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold" style={{ color: MUTED }}>Liên kết giới thiệu của bạn</label>
        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#09090F', border: `1px solid ${BORDER}` }}>
          <input
            type="text"
            readOnly
            value={refLink}
            className="bg-transparent border-none outline-none font-mono text-xs text-indigo-400 flex-1 truncate select-all"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1"
            style={{
              background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
              color: copied ? '#4ADE80' : TEXT,
              border: `1px solid ${copied ? 'rgba(34,197,94,0.25)' : BORDER}`
            }}
          >
            <Copy className="w-3 h-3" />
            {copied ? 'Đã copy' : 'Copy'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   6. Support Tickets Section
   ──────────────────────────────────────────────────────────────── */
function SupportSection() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/portal/tickets');
      setTickets(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const response = await api.post('/portal/tickets', { subject, content });
      setTickets(prev => [response.data, ...prev]);
      setSubject('');
      setContent('');
      setShowForm(false);
      alert("Đã gửi yêu cầu trợ giúp thành công!");
    } catch (err) {
      console.error(err);
      alert("Gửi hỗ trợ thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h3 className="text-xl font-bold font-display" style={{ fontFamily: "'Bodoni Moda', serif", color: TEXT }}>
            Hỗ trợ & Trợ giúp kỹ thuật
          </h3>
          <p className="text-xs" style={{ color: MUTED }}>Tạo phiếu hỗ trợ đến đội ngũ điều hành kỹ thuật</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
            style={{ background: 'rgba(202,138,4,0.08)', border: `1px solid rgba(202,138,4,0.25)`, color: GOLD_LIGHT }}
          >
            <Plus className="w-3.5 h-3.5" />
            Gửi yêu cầu
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl p-5 border" style={{ background: SURFACE2, borderColor: BORDER }}>
          <h4 className="font-bold text-xs" style={{ color: TEXT }}>Yêu cầu hỗ trợ mới</h4>
          <div>
            <label className="block text-[10px] font-semibold mb-1" style={{ color: MUTED }}>Chủ đề/Sản phẩm gặp lỗi</label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Ví dụ: Tài khoản Netflix Premium bị sai mật khẩu"
              className="w-full px-3 py-2 rounded-xl text-xs outline-none"
              style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold mb-1" style={{ color: MUTED }}>Nội dung chi tiết lỗi</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Vui lòng cung cấp chi tiết lỗi..."
              className="w-full px-3 py-2 rounded-xl text-xs outline-none resize-none"
              style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
            />
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer border"
              style={{ background: SURFACE, color: MUTED, borderColor: BORDER }}
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
              style={{ background: 'linear-gradient(135deg, #CA8A04, #FBBF24)', color: BACKGROUND }}
            >
              {submitting && <Loader className="w-3.5 h-3.5 animate-spin" />}
              Gửi Ticket
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center gap-2 text-xs py-6" style={{ color: MUTED }}>
              <Loader className="w-4 h-4 animate-spin" /> Đang tải danh sách ticket...
            </div>
          ) : tickets.length === 0 ? (
            <p className="text-xs italic text-center py-6" style={{ color: MUTED }}>Chưa có yêu cầu hỗ trợ nào.</p>
          ) : (
            tickets.map(ticket => {
              const isOpen = ticket.status === 'open' || ticket.status === 'pending';
              return (
                <div
                  key={ticket.id}
                  className="rounded-xl p-4 space-y-2"
                  style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}
                >
                  <div className="flex justify-between items-center gap-3">
                    <span className="font-semibold text-xs" style={{ color: TEXT }}>{ticket.subject}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase"
                      style={{
                        background: isOpen ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.12)',
                        color: isOpen ? '#F59E0B' : '#22C55E'
                      }}
                    >
                      {isOpen ? 'Đang xử lý' : 'Đã phản hồi'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{ticket.content}</p>
                  <p className="text-[9px] text-right" style={{ color: MUTED }}>
                    Gửi lúc: {new Date(ticket.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}
    </motion.div>
  );
}
