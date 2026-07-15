import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ShoppingCart, Star,
  Zap, Brain, BookOpen, Gamepad2, Cloud, Shield,
  Tv, Music, Camera, FileText, Globe, Package,
  ArrowRight, CheckCircle, Headphones, BadgePercent,
  Sparkles, Briefcase, MonitorPlay
} from 'lucide-react';

/* ─── Types ────────────────────────────────────────────────────── */
interface SampleProduct {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  badge?: string;
  rating: number;
  sold: number;
  accent: string;
  icon: React.ReactNode;
}

/* ─── Data ─────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    id: 1,
    title: 'Tài khoản AI Cao Cấp',
    subtitle: 'ChatGPT Plus, Gemini Ultra, Cursor AI Pro',
    desc: 'Trải nghiệm AI thế hệ mới với giá sinh viên. Bảo hành 1 đổi 1.',
    cta: 'Mua ngay',
    href: '/products?category=ai',
    gradient: 'from-violet-900 via-purple-900 to-indigo-950',
    accent: '#8B5CF6',
    image: '/Ai.png',
  },
  {
    id: 2,
    title: 'Học tập & Làm việc',
    subtitle: 'Microsoft 365, Canva Pro, Figma, Coursera Plus',
    desc: 'Bộ công cụ đỉnh cao dành cho học sinh, sinh viên và dân văn phòng.',
    cta: 'Khám phá',
    href: '/products?category=study',
    gradient: 'from-sky-900 via-cyan-900 to-teal-950',
    accent: '#0EA5E9',
    image: '/study_banner.png',
  },
  {
    id: 3,
    title: 'Giải trí Không Giới Hạn',
    subtitle: 'Netflix, Spotify, YouTube Premium, CapCut Pro',
    desc: 'Gói giải trí tổng hợp với giá ưu đãi, hỗ trợ 24/7.',
    cta: 'Xem ngay',
    href: '/products?category=entertainment',
    gradient: 'from-rose-900 via-pink-900 to-orange-950',
    accent: '#F43F5E',
    image: '/entertainment_banner.png',
  },
];

const SIDEBAR_CATEGORIES = [
  { icon: <Brain className="w-4 h-4" />, name: 'Tài khoản AI', href: '/products?category=ai', hot: true },
  { icon: <BookOpen className="w-4 h-4" />, name: 'Học tập', href: '/products?category=study' },
  { icon: <Tv className="w-4 h-4" />, name: 'Giải trí', href: '/products?category=entertainment' },
  { icon: <Zap className="w-4 h-4" />, name: 'Mua Nhanh', href: '/products?category=flash', hot: true },
  { icon: <Cloud className="w-4 h-4" />, name: 'Lưu Trữ', href: '/products?category=storage' },
  { icon: <Shield className="w-4 h-4" />, name: 'VPN & Bảo mật', href: '/products?category=vpn' },
  { icon: <Gamepad2 className="w-4 h-4" />, name: 'Kho Game', href: '/products?category=game' },
  { icon: <Music className="w-4 h-4" />, name: 'Âm nhạc', href: '/products?category=music' },
  { icon: <Camera className="w-4 h-4" />, name: 'Chỉnh sửa ảnh', href: '/products?category=photo' },
  { icon: <Globe className="w-4 h-4" />, name: 'Liên hệ', href: '/contact' },
];
const PROMO_BANNERS = [
  { label: 'CapCut Pro', sub: 'Giảm 50% hôm nay', color: '#1C1917', accent: '#F97316' },
  { label: 'YouTube Premium', sub: 'Chỉ từ 29.000đ/tháng', color: '#1A0A0A', accent: '#EF4444' },
];

const QUICK_BRANDS = [
  { name: 'ChatGPT Plus', color: '#10A37F', icon: <Brain className="w-6 h-6" /> },
  { name: 'Canva Pro', color: '#00C4CC', icon: <Camera className="w-6 h-6" /> },
  { name: 'Netflix', color: '#E50914', icon: <Tv className="w-6 h-6" /> },
  { name: 'Spotify', color: '#1DB954', icon: <Music className="w-6 h-6" /> },
  { name: 'Adobe All App', color: '#FF0000', icon: <FileText className="w-6 h-6" /> },
  { name: 'Google Drive', color: '#1967D2', icon: <Cloud className="w-6 h-6" /> },
  { name: 'Microsoft 365', color: '#D83B01', icon: <Package className="w-6 h-6" /> },
  { name: 'Figma Pro', color: '#A259FF', icon: <Globe className="w-6 h-6" /> },
];

const SHOPS: Array<{
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  products: SampleProduct[];
}> = [
  {
    title: 'Gian hàng Tài khoản AI',
    icon: <Sparkles className="w-5 h-5" />,
    accentColor: '#8B5CF6',
    products: [
      { id: 1, name: 'ChatGPT Plus (GPT-4o)', price: 199000, oldPrice: 599000, discount: 67, badge: 'Bán chạy', rating: 5.0, sold: 1420, accent: '#10A37F', icon: <Brain className="w-8 h-8" /> },
      { id: 2, name: 'Gemini Ultra VEO 3', price: 249000, oldPrice: 799000, discount: 69, badge: 'Hot', rating: 4.9, sold: 876, accent: '#1967D2', icon: <Zap className="w-8 h-8" /> },
      { id: 3, name: 'Cursor AI Pro', price: 299000, oldPrice: 899000, discount: 67, badge: 'Mới', rating: 4.8, sold: 543, accent: '#A259FF', icon: <Globe className="w-8 h-8" /> },
      { id: 4, name: 'Manus AI Premium', price: 179000, oldPrice: 499000, discount: 64, rating: 4.7, sold: 321, accent: '#F97316', icon: <Brain className="w-8 h-8" /> },
      { id: 5, name: 'Monica AI Unlimited', price: 149000, oldPrice: 450000, discount: 67, rating: 4.8, sold: 289, accent: '#EC4899', icon: <Headphones className="w-8 h-8" /> },
      { id: 6, name: 'Deepl Translate Pro', price: 129000, oldPrice: 399000, discount: 68, badge: 'Giá rẻ', rating: 4.6, sold: 712, accent: '#0EA5E9', icon: <Globe className="w-8 h-8" /> },
      { id: 7, name: 'Beautiful AI Edu', price: 199000, oldPrice: 550000, discount: 64, rating: 4.7, sold: 198, accent: '#F59E0B', icon: <Camera className="w-8 h-8" /> },
      { id: 8, name: 'Super Grok AI (Grok 4)', price: 299000, oldPrice: 899000, discount: 67, badge: 'Mới nhất', rating: 4.9, sold: 156, accent: '#6366F1', icon: <Brain className="w-8 h-8" /> },
    ],
  },
  {
    title: 'Gian hàng Học tập & Làm việc',
    icon: <Briefcase className="w-5 h-5" />,
    accentColor: '#0EA5E9',
    products: [
      { id: 9, name: 'Microsoft 365 Personal', price: 129000, oldPrice: 399000, discount: 68, badge: 'Bán chạy', rating: 4.9, sold: 2341, accent: '#D83B01', icon: <Package className="w-8 h-8" /> },
      { id: 10, name: 'Canva Pro 1 năm', price: 99000, oldPrice: 299000, discount: 67, badge: 'Hot', rating: 4.8, sold: 3102, accent: '#00C4CC', icon: <Camera className="w-8 h-8" /> },
      { id: 11, name: 'Figma Pro Education', price: 149000, oldPrice: 450000, discount: 67, rating: 4.7, sold: 876, accent: '#A259FF', icon: <Globe className="w-8 h-8" /> },
      { id: 12, name: 'Coursera Plus 1 tháng', price: 199000, oldPrice: 599000, discount: 67, rating: 4.8, sold: 654, accent: '#0056D2', icon: <BookOpen className="w-8 h-8" /> },
      { id: 13, name: 'Quillbot Premium', price: 89000, oldPrice: 299000, discount: 70, badge: 'Siêu rẻ', rating: 4.7, sold: 1823, accent: '#22C55E', icon: <FileText className="w-8 h-8" /> },
      { id: 14, name: 'Gamma AI Pro', price: 119000, oldPrice: 350000, discount: 66, rating: 4.6, sold: 432, accent: '#8B5CF6', icon: <Zap className="w-8 h-8" /> },
      { id: 15, name: 'Turnitin Student', price: 99000, oldPrice: 299000, discount: 67, rating: 4.5, sold: 987, accent: '#EF4444', icon: <FileText className="w-8 h-8" /> },
      { id: 16, name: 'WPS Office Pro', price: 79000, oldPrice: 199000, discount: 60, badge: 'Mới', rating: 4.6, sold: 543, accent: '#F97316', icon: <Package className="w-8 h-8" /> },
    ],
  },
  {
    title: 'Gian hàng Giải trí',
    icon: <MonitorPlay className="w-5 h-5" />,
    accentColor: '#F43F5E',
    products: [
      { id: 17, name: 'Netflix Premium 4K', price: 79000, oldPrice: 260000, discount: 70, badge: 'Bán chạy', rating: 4.9, sold: 5421, accent: '#E50914', icon: <Tv className="w-8 h-8" /> },
      { id: 18, name: 'Spotify Premium', price: 29000, oldPrice: 59000, discount: 51, badge: 'Rẻ nhất', rating: 4.8, sold: 7832, accent: '#1DB954', icon: <Music className="w-8 h-8" /> },
      { id: 19, name: 'YouTube Premium', price: 49000, oldPrice: 149000, discount: 67, rating: 4.7, sold: 3421, accent: '#FF0000', icon: <Tv className="w-8 h-8" /> },
      { id: 20, name: 'CapCut Pro 1 tháng', price: 59000, oldPrice: 179000, discount: 67, badge: 'Hot', rating: 4.8, sold: 2109, accent: '#000000', icon: <Camera className="w-8 h-8" /> },
    ],
  },
];

/* ─── Helpers ──────────────────────────────────────────────────── */
const fmt = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
});

/* ─── Sub-components ───────────────────────────────────────────── */
function ProductMiniCard({ p }: { p: SampleProduct }) {
  return (
    <Link
      to={`/products/${p.id}`}
      className="group flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(202,138,4,0.3)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
    >
      {/* Thumbnail */}
      <div
        className="relative flex items-center justify-center h-32"
        style={{ background: p.accent + '18' }}
      >
        {/* Discount badge */}
        <span
          className="absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded"
          style={{ background: '#EF4444', color: '#fff' }}
        >
          -{p.discount}%
        </span>
        {p.badge && (
          <span
            className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ background: p.accent + '33', color: p.accent, border: `1px solid ${p.accent}55` }}
          >
            {p.badge}
          </span>
        )}
        <div style={{ color: p.accent }} className="opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
          {p.icon}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-grow">
        <p
          className="font-body text-xs font-semibold leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors duration-200"
          style={{ color: '#E7E5E4' }}
        >
          {p.name}
        </p>

        {/* Rating + Sold */}
        <div className="flex items-center gap-1 mt-0.5">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="font-body text-[11px] text-amber-400">{p.rating}</span>
          <span className="font-body text-[11px]" style={{ color: '#57534E' }}>· {p.sold.toLocaleString()} đã bán</span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-1">
          <span className="font-body text-xs line-through" style={{ color: '#57534E' }}>{fmt(p.oldPrice)}</span>
          <div className="font-body font-bold text-sm" style={{ color: '#CA8A04' }}>{fmt(p.price)}</div>
        </div>

        <button
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(202,138,4,0.15)', color: '#FBBF24', border: '1px solid rgba(202,138,4,0.3)' }}
          onClick={e => e.preventDefault()}
        >
          <ShoppingCart className="w-3.5 h-3.5" /> Thêm vào giỏ
        </button>
      </div>
    </Link>
  );
}

function ShopSection({ shop }: { shop: typeof SHOPS[0] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? shop.products : shop.products.slice(0, 4);

  return (
    <motion.section {...fadeUp()} className="mb-12">
      {/* Section header */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl mb-4"
        style={{ background: shop.accentColor + '18', border: `1px solid ${shop.accentColor}30` }}
      >
        <div className="flex items-center gap-2">
          <div style={{ color: shop.accentColor }}>{shop.icon}</div>
          <h2
            className="font-body font-bold text-base"
            style={{ color: shop.accentColor === '#F43F5E' ? '#FDA4AF' : shop.accentColor === '#0EA5E9' ? '#7DD3FC' : '#C4B5FD' }}
          >
            {shop.title}
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-body"
            style={{ background: shop.accentColor + '25', color: shop.accentColor }}
          >
            {shop.products.length} sản phẩm
          </span>
        </div>
        <Link
          to="/products"
          className="font-body text-xs flex items-center gap-1 cursor-pointer transition-colors duration-200 hover:text-amber-400"
          style={{ color: '#78716C' }}
        >
          Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <AnimatePresence>
          {visible.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <ProductMiniCard p={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {shop.products.length > 4 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(v => !v)}
            className="font-body text-sm px-8 py-2.5 rounded-full cursor-pointer transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#A8A29E',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(202,138,4,0.4)'; (e.currentTarget as HTMLButtonElement).style.color = '#FBBF24'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#A8A29E'; }}
          >
            {showAll ? 'Thu gọn' : `Xem thêm ${shop.products.length - 4} sản phẩm`}
          </button>
        </div>
      )}
    </motion.section>
  );
}

/* ─── Main Page ────────────────────────────────────────────────── */
export default function HomePage() {
  const [slide, setSlide] = useState(0);

  // Auto-play slider
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const prev = () => setSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => setSlide(s => (s + 1) % HERO_SLIDES.length);

  return (
    <div style={{ background: '#0C0A09', color: '#D6D3D1', fontFamily: "'Jost', sans-serif" }}>

      {/* ── Announcement bar ──────────────────────────────────── */}
      <div
        className="text-center py-2 px-4 text-xs font-body font-medium"
        style={{ background: 'rgba(202,138,4,0.12)', borderBottom: '1px solid rgba(202,138,4,0.2)', color: '#FBBF24' }}
      >
        ⚡ Quý khách muốn tìm sản phẩm theo yêu cầu → Vui lòng{' '}
        <Link to="/contact" className="underline underline-offset-2 hover:text-amber-300 transition-colors">
          Liên hệ Admin
        </Link>
      </div>

      {/* ── HERO: 3-column layout ──────────────────────────────── */}
      <section className="container-custom py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_180px] gap-4">

          {/* LEFT: Sidebar category menu */}
          <aside
            className="hidden lg:flex flex-col rounded-xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div
              className="px-4 py-3 font-body font-bold text-sm"
              style={{ background: 'rgba(202,138,4,0.15)', color: '#FBBF24', borderBottom: '1px solid rgba(202,138,4,0.2)' }}
            >
              Phân loại sản phẩm
            </div>
            <ul className="flex-1 py-1">
              {SIDEBAR_CATEGORIES.map(cat => (
                <li key={cat.name}>
                  <Link
                    to={cat.href}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-body transition-all duration-200 cursor-pointer group"
                    style={{ color: '#A8A29E' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(202,138,4,0.08)'; (e.currentTarget as HTMLElement).style.color = '#FBBF24'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#A8A29E'; }}
                  >
                    <span style={{ color: '#CA8A04' }}>{cat.icon}</span>
                    {cat.name}
                    {cat.hot && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: '#EF4444', color: '#fff' }}>
                        HOT
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* CENTER: Hero slider */}
          <div className="relative overflow-hidden rounded-xl" style={{ minHeight: 260 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute inset-0 bg-gradient-to-br ${HERO_SLIDES[slide].gradient} flex flex-col justify-center px-8 md:px-12`}
              >
                {/* Full Background Image */}
                {HERO_SLIDES[slide].image && (
                  <>
                    <img 
                      src={HERO_SLIDES[slide].image} 
                      alt={HERO_SLIDES[slide].title} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Dark gradient overlay so text is readable */}
                    <div className="absolute inset-0 bg-black/60 md:bg-gradient-to-r md:from-black/80 md:to-transparent" />
                  </>
                )}

                {/* Glow blob (optional, can keep for effect) */}
                {!HERO_SLIDES[slide].image && (
                  <div
                    className="absolute right-10 top-1/2 -translate-y-1/2 w-52 h-52 rounded-full opacity-20 blur-3xl"
                    style={{ background: HERO_SLIDES[slide].accent }}
                  />
                )}
                
                <div className="relative z-10 w-full max-w-2xl">
                  <p
                    className="font-body text-xs uppercase tracking-widest mb-3 font-semibold"
                    style={{ color: HERO_SLIDES[slide].accent }}
                  >
                    ShopDV Premium
                  </p>
                  <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 text-white leading-tight drop-shadow-lg" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                    {HERO_SLIDES[slide].title}
                  </h1>
                  <p className="font-body text-base md:text-lg mb-2 font-medium drop-shadow-md" style={{ color: HERO_SLIDES[slide].accent }}>
                    {HERO_SLIDES[slide].subtitle}
                  </p>
                  <p className="font-body text-sm md:text-base text-white/90 mb-8 max-w-lg drop-shadow-md leading-relaxed">{HERO_SLIDES[slide].desc}</p>
                  
                  <Link
                    to={HERO_SLIDES[slide].href}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-body font-bold text-sm md:text-base cursor-pointer transition-all duration-300 w-fit hover:-translate-y-1 hover:scale-105"
                    style={{
                      background: HERO_SLIDES[slide].accent,
                      color: '#fff',
                      boxShadow: `0 8px 32px ${HERO_SLIDES[slide].accent}66`,
                    }}
                  >
                    {HERO_SLIDES[slide].cta} <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next */}
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all z-10" style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all z-10" style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className="h-1.5 rounded-full cursor-pointer transition-all duration-300"
                  style={{ width: i === slide ? 20 : 6, background: i === slide ? '#CA8A04' : 'rgba(255,255,255,0.35)' }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Promo banners */}
          <div className="hidden lg:flex flex-col gap-3">
            {PROMO_BANNERS.map((b, i) => (
              <Link
                key={i}
                to="/products"
                className="flex-1 rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background: b.color,
                  border: `1px solid ${b.accent}40`,
                  minHeight: 120,
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                  style={{ background: b.accent + '22' }}
                >
                  <Zap className="w-5 h-5" style={{ color: b.accent }} />
                </div>
                <p className="font-body font-bold text-sm text-white">{b.label}</p>
                <p className="font-body text-xs mt-0.5" style={{ color: b.accent }}>{b.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick brand grid ──────────────────────────────────── */}
      <section className="container-custom pb-6">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {QUICK_BRANDS.map((b) => (
            <Link
              key={b.name}
              to={`/products?q=${b.name}`}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-1 group"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(202,138,4,0.35)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
            >
              <div style={{ color: b.color }} className="group-hover:scale-110 transition-transform duration-200">
                {b.icon}
              </div>
              <span className="font-body text-[10px] text-center leading-tight" style={{ color: '#78716C' }}>{b.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trust badges ─────────────────────────────────────── */}
      <section
        className="py-4 mb-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <CheckCircle className="w-5 h-5" />, text: 'Bảo hành 1 đổi 1' },
            { icon: <Zap className="w-5 h-5" />, text: 'Giao tài khoản tự động' },
            { icon: <Headphones className="w-5 h-5" />, text: 'Hỗ trợ 24/7' },
            { icon: <BadgePercent className="w-5 h-5" />, text: 'Giá sinh viên' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2.5">
              <span style={{ color: '#CA8A04' }}>{icon}</span>
              <span className="font-body text-sm font-medium" style={{ color: '#A8A29E' }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Shop sections ─────────────────────────────────────── */}
      <div className="container-custom pb-16">
        {SHOPS.map(shop => (
          <ShopSection key={shop.title} shop={shop} />
        ))}
      </div>
    </div>
  );
}
