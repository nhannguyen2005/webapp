import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Wallet, Smartphone, ShieldCheck, ArrowLeft, Loader, AlertCircle } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
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

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'bank_transfer' | 'vnpay' | 'momo'>('wallet');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [userBalance, setUserBalance] = useState(0);

  // Load balance for wallet payment
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }

    const fetchBalance = async () => {
      try {
        const { data } = await api.get('/portal/me');
        setUserBalance(Number(data.balance || 0));
      } catch (err) {
        console.error("Lỗi tải ví:", err);
      }
    };

    fetchBalance();
  }, [user, navigate]);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setError('');
    setLoading(true);

    try {
      const checkoutItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }));

      await api.post('/portal/orders/checkout', {
        items: checkoutItems,
        payment_method: paymentMethod.toUpperCase()
      });

      setSuccess(true);
      clearCart();

      // Redirect to digital library after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (err: any) {
      console.error("Lỗi đặt hàng:", err);
      setError(err.response?.data?.detail || 'Đặt hàng thất bại. Vui lòng kiểm tra lại số dư hoặc số lượng tồn kho.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <AnimatedPage className="container-custom py-16 text-center" style={{ background: BACKGROUND }}>
        <div className="max-w-md mx-auto p-8 rounded-3xl" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: TEXT }}>Giỏ hàng của bạn đang trống</h2>
          <p className="text-xs mb-6" style={{ color: MUTED }}>Hãy quay lại chọn sản phẩm để thanh toán</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, #CA8A04, #FBBF24)', color: BACKGROUND }}
          >
            <ArrowLeft className="w-4 h-4" />
            Xem các sản phẩm
          </Link>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="min-h-screen py-12" style={{ background: BACKGROUND, fontFamily: "'Jost', sans-serif" }}>
      <div className="container-custom max-w-5xl">
        <h1
          className="text-3xl font-extrabold text-center mb-8"
          style={{
            background: 'linear-gradient(135deg, #CA8A04, #FBBF24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Xác nhận thanh toán
        </h1>

        {success ? (
          <div className="max-w-md mx-auto p-8 rounded-3xl text-center space-y-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold" style={{ color: TEXT }}>Thanh toán hoàn tất!</h2>
            <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
              Tài khoản số của bạn đã được bàn giao tự động. Đang chuyển hướng bạn đến thư viện số...
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-5 py-2.5 rounded-xl font-bold text-xs"
              style={{ background: 'linear-gradient(135deg, #CA8A04, #FBBF24)', color: BACKGROUND }}
            >
              Xem ngay thư viện số
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side: Checkout details */}
            <div className="flex-1 space-y-6">
              
              {/* Profile info validation */}
              <div className="rounded-3xl p-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>1. Thông tin giao hàng số</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Tài khoản nhận</span>
                    <span className="block font-bold mt-0.5" style={{ color: TEXT }}>{user?.username}</span>
                  </div>
                  <div className="p-3.5 rounded-xl" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Email nhận hàng</span>
                    <span className="block font-bold mt-0.5" style={{ color: TEXT }}>{user?.email}</span>
                  </div>
                </div>
              </div>

              {/* Payment selection */}
              <div className="rounded-3xl p-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <h3 className="text-base font-bold mb-4" style={{ color: TEXT }}>2. Chọn phương thức thanh toán</h3>
                <div className="space-y-3">
                  
                  {/* ShopDV Wallet */}
                  <label
                    onClick={() => setPaymentMethod('wallet')}
                    className="flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all"
                    style={{
                      background: paymentMethod === 'wallet' ? 'rgba(202,138,4,0.04)' : SURFACE2,
                      borderColor: paymentMethod === 'wallet' ? GOLD : BORDER
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'wallet'}
                        onChange={() => setPaymentMethod('wallet')}
                        className="accent-yellow-600"
                      />
                      <div>
                        <span className="block font-semibold text-xs" style={{ color: TEXT }}>Thanh toán bằng số dư Ví ShopDV</span>
                        <span className="block text-[10px] mt-0.5" style={{ color: GOLD_LIGHT }}>
                          Khả dụng: {fmt(userBalance)}
                        </span>
                      </div>
                    </div>
                    <Wallet className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
                  </label>

                  {/* Bank Transfer */}
                  <label
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className="flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all"
                    style={{
                      background: paymentMethod === 'bank_transfer' ? 'rgba(202,138,4,0.04)' : SURFACE2,
                      borderColor: paymentMethod === 'bank_transfer' ? GOLD : BORDER
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => setPaymentMethod('bank_transfer')}
                        className="accent-yellow-600"
                      />
                      <div>
                        <span className="block font-semibold text-xs" style={{ color: TEXT }}>Chuyển khoản Ngân hàng (Xác nhận tự động)</span>
                        <span className="block text-[10px] mt-0.5" style={{ color: MUTED }}>Chuyển khoản qua mã QR nhận tài khoản ngay</span>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 shrink-0" style={{ color: MUTED }} />
                  </label>

                  {/* VNPay */}
                  <label
                    onClick={() => setPaymentMethod('vnpay')}
                    className="flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all"
                    style={{
                      background: paymentMethod === 'vnpay' ? 'rgba(202,138,4,0.04)' : SURFACE2,
                      borderColor: paymentMethod === 'vnpay' ? GOLD : BORDER
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'vnpay'}
                        onChange={() => setPaymentMethod('vnpay')}
                        className="accent-yellow-600"
                      />
                      <div>
                        <span className="block font-semibold text-xs" style={{ color: TEXT }}>Cổng thanh toán VNPay</span>
                        <span className="block text-[10px] mt-0.5" style={{ color: MUTED }}>Thanh toán qua thẻ ATM, quét mã VNPAY-QR</span>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 shrink-0" style={{ color: MUTED }} />
                  </label>

                  {/* Momo */}
                  <label
                    onClick={() => setPaymentMethod('momo')}
                    className="flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all"
                    style={{
                      background: paymentMethod === 'momo' ? 'rgba(202,138,4,0.04)' : SURFACE2,
                      borderColor: paymentMethod === 'momo' ? GOLD : BORDER
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'momo'}
                        onChange={() => setPaymentMethod('momo')}
                        className="accent-yellow-600"
                      />
                      <div>
                        <span className="block font-semibold text-xs" style={{ color: TEXT }}>Thanh toán Ví MoMo</span>
                        <span className="block text-[10px] mt-0.5" style={{ color: MUTED }}>Quét mã QR bằng ứng dụng MoMo</span>
                      </div>
                    </div>
                    <Smartphone className="w-5 h-5 shrink-0" style={{ color: MUTED }} />
                  </label>

                </div>
              </div>

            </div>

            {/* Right side: Summary & Submit */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="rounded-3xl p-6 space-y-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <h3 className="text-base font-bold" style={{ color: TEXT }}>Giỏ hàng</h3>
                
                {/* Product list */}
                <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold line-clamp-1" style={{ color: TEXT }}>{item.product.name}</p>
                        <p className="mt-0.5" style={{ color: MUTED }}>
                          Số lượng: <span className="font-bold">{item.quantity}</span>
                        </p>
                      </div>
                      <span className="font-bold font-mono text-green-400">
                        {fmt((item.product.sale_price || item.product.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4" style={{ borderColor: BORDER }}>
                  <div className="flex justify-between items-center text-xs">
                    <span style={{ color: MUTED }}>Tổng cộng thanh toán</span>
                    <span className="text-lg font-black font-mono text-green-400">{fmt(getTotalPrice())}</span>
                  </div>
                </div>

                {error && (
                  <div
                    className="flex items-start gap-2 p-3 rounded-xl text-[10px] font-semibold border"
                    style={{
                      background: 'rgba(239, 68, 68, 0.07)',
                      borderColor: 'rgba(239, 68, 68, 0.2)',
                      color: '#F87171'
                    }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-xs cursor-pointer transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #CA8A04, #FBBF24)',
                    color: BACKGROUND,
                    boxShadow: '0 4px 16px rgba(202, 138, 4, 0.2)'
                  }}
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Đang xử lý đơn hàng...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Xác nhận mua hàng</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center" style={{ color: MUTED }}>
                  Sản phẩm kỹ thuật số được bàn giao lập tức ngay khi thanh toán.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
