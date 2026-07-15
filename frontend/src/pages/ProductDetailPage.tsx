import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Zap, Star, CheckCircle, Loader, ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useCartStore } from '../stores/cartStore';
import AnimatedPage from '../components/layout/AnimatedPage';
import { cn, formatPrice } from '../utils';
import { api } from '../services/api';
import type { Product } from '../types';

const BACKGROUND = '#0C0A09';
const SURFACE = '#1C1917';
const SURFACE2 = '#292524';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT = '#F5F5F4';
const MUTED = '#A8A29E';
const GOLD_LIGHT = '#FBBF24';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const addItem = useCartStore(state => state.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const response = await api.get(`/products/${slug}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <AnimatedPage className="min-h-[70vh] flex items-center justify-center text-gray-400" style={{ background: BACKGROUND }}>
        <Loader className="w-8 h-8 animate-spin" />
        <span className="ml-2 text-xs font-semibold">Đang tải chi tiết sản phẩm...</span>
      </AnimatedPage>
    );
  }

  if (!product) {
    return (
      <AnimatedPage className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4" style={{ background: BACKGROUND }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: TEXT }}>Không tìm thấy sản phẩm</h2>
        <p className="text-xs mb-6" style={{ color: MUTED }}>Sản phẩm này có thể không tồn tại hoặc đã bị ngừng cung cấp.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs"
          style={{ background: 'linear-gradient(135deg, #CA8A04, #FBBF24)', color: BACKGROUND }}
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </Link>
      </AnimatedPage>
    );
  }

  const discountPercent = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100) 
    : 0;

  return (
    <AnimatedPage className="py-12" style={{ background: BACKGROUND, fontFamily: "'Jost', sans-serif" }}>
      <div className="container-custom max-w-6xl flex flex-col lg:flex-row gap-12">
        
        {/* Left: Product Images & Description */}
        <div className="flex-1 space-y-8">
          {/* Main Image Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full aspect-[4/3] md:aspect-[16/9] rounded-3xl overflow-hidden shadow-lg border relative group"
            style={{ background: SURFACE, borderColor: BORDER }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold font-mono text-base uppercase tracking-wider">
               {product.name}
            </div>
            
            {product.category && (
              <div className="absolute top-4 left-4 bg-yellow-600 text-black px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                {product.category.name}
              </div>
            )}
          </motion.div>

          {/* Description & Reviews Tabs */}
          <div className="rounded-3xl p-6 md:p-8" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <TabGroup>
              <TabList className="flex gap-4 border-b pb-4" style={{ borderColor: BORDER }}>
                {['Mô tả sản phẩm', `Đánh giá (${product.review_count || 0})`].map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      cn(
                        'px-4 py-2 text-xs font-bold rounded-xl transition-all focus:outline-none cursor-pointer',
                        selected
                          ? 'bg-yellow-600 text-black shadow-md'
                          : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-600/5'
                      )
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </TabList>
              <TabPanels className="mt-6">
                <TabPanel className="focus:outline-none">
                  <div className="prose max-w-none space-y-4">
                    <p className="whitespace-pre-line leading-relaxed text-sm text-gray-300">
                      {product.description || 'Không có mô tả chi tiết cho sản phẩm này.'}
                    </p>
                  </div>
                </TabPanel>
                <TabPanel className="focus:outline-none">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4 p-6 rounded-2xl" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                      <div className="text-4xl font-black text-yellow-500">{product.avg_rating || '5.0'}</div>
                      <div>
                        <div className="flex text-yellow-500 mb-1">
                          {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <div className="text-xs font-medium text-gray-400">Dựa trên {product.review_count || 0} đánh giá thực tế</div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>

        {/* Right: Checkout Sidebar */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="rounded-3xl p-6 md:p-8 space-y-6 sticky top-24 shadow-xl border" style={{ background: SURFACE, borderColor: BORDER }}>
            <div>
              <h1 className="text-xl font-bold leading-tight" style={{ fontFamily: "'Bodoni Moda', serif", color: TEXT }}>
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold ml-1">{product.avg_rating || '5.0'}</span>
                </div>
                <span className="text-xs" style={{ color: MUTED }}>Đã bán: <strong style={{ color: TEXT }}>{product.sold_count || 0}</strong></span>
              </div>
            </div>

            <div className="border-t border-b py-4 space-y-2" style={{ borderColor: BORDER }}>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black font-mono text-green-400">
                  {formatPrice(product.sale_price || product.price)}
                </span>
                {product.sale_price && (
                  <span className="text-xs line-through font-mono" style={{ color: MUTED }}>
                    {formatPrice(product.price)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded font-bold">
                    -{discountPercent}%
                  </span>
                )}
              </div>
              <p className="text-[10px]" style={{ color: GOLD_LIGHT }}>⚡ Giao hàng tự động qua ví số dư hoặc tài khoản ngân hàng</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold" style={{ color: TEXT }}>Số lượng mua</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-lg text-lg font-bold flex items-center justify-center cursor-pointer transition-colors"
                  style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold font-mono" style={{ color: TEXT }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 rounded-lg text-lg font-bold flex items-center justify-center cursor-pointer transition-colors"
                  style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 rounded-xl font-bold text-xs cursor-pointer transition-all duration-200 flex items-center justify-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, #CA8A04, #FBBF24)',
                color: BACKGROUND,
                boxShadow: '0 4px 16px rgba(202, 138, 4, 0.2)'
              }}
            >
              {added ? (
                <>
                  <CheckCircle className="w-4 h-4 text-black" />
                  <span>Đã thêm giỏ hàng!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Mua ngay</span>
                </>
              )}
            </button>

            <div className="space-y-3.5 pt-4 text-[10px]" style={{ color: MUTED }}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                <span>Bảo hành 1 đổi 1 suốt thời gian đăng ký</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500 shrink-0" />
                <span>Bàn giao tài khoản tự động ngay lập tức</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </AnimatedPage>
  );
}
