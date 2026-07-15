import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Search } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import React, { useState } from 'react';

export default function MainLayout() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0C0A09', color: '#D6D3D1' }}>

      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(12,10,9,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="container-custom h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="font-display text-2xl font-bold shrink-0 transition-opacity duration-200 hover:opacity-80"
            style={{
              background: 'linear-gradient(135deg,#CA8A04,#FBBF24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: "'Bodoni Moda', serif",
            }}
          >
            ShopDV
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 font-body font-medium text-sm">
            {[
              { to: '/', label: 'Trang chủ' },
              { to: '/products', label: 'Sản phẩm' },
              { to: '/news', label: 'Tin tức' },
              { to: '/contact', label: 'Liên hệ' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="transition-colors duration-200 hover:text-amber-400"
                style={{ color: '#A8A29E' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm px-4 py-2.5 pl-10 rounded-full outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#F5F5F0',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(202,138,4,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#78716C' }} />
            </form>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full transition-all duration-200 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(202,138,4,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            >
              <ShoppingCart className="w-5 h-5" style={{ color: '#D6D3D1' }} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold flex items-center justify-center rounded-full"
                  style={{ background: '#CA8A04', color: '#0C0A09' }}
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 cursor-pointer"
                  style={{ background: 'rgba(202,138,4,0.12)', border: '1px solid rgba(202,138,4,0.25)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(202,138,4,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(202,138,4,0.12)')}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: '#CA8A04', color: '#0C0A09' }}
                  >
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block font-body text-sm font-medium" style={{ color: '#D6D3D1' }}>
                    {user?.username}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-full transition-all duration-200 cursor-pointer"
                  style={{ color: '#78716C', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#78716C'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  aria-label="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="font-body text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg,#CA8A04,#FBBF24)',
                  color: '#0C0A09',
                }}
                onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
                onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer style={{ background: '#111110', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="container-custom py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3
              className="font-display text-2xl font-bold mb-4"
              style={{
                background: 'linear-gradient(135deg,#CA8A04,#FBBF24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: "'Bodoni Moda', serif",
              }}
            >
              ShopDV
            </h3>
            <p className="font-body text-sm leading-relaxed" style={{ color: '#78716C' }}>
              Chuyên cung cấp tài khoản bản quyền giá rẻ, uy tín, chất lượng với chính sách bảo hành 1 đổi 1.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: '#A8A29E' }}>Liên kết</h4>
            <ul className="space-y-3">
              {[{ to: '/', label: 'Trang chủ' }, { to: '/products', label: 'Sản phẩm' }, { to: '/news', label: 'Tin tức' }].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="font-body text-sm transition-colors duration-200 hover:text-amber-400" style={{ color: '#57534E' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: '#A8A29E' }}>Hỗ trợ</h4>
            <ul className="space-y-3">
              {['FAQ', 'Chính sách bảo hành', 'Điều khoản dịch vụ'].map(item => (
                <li key={item}>
                  <a href="#" className="font-body text-sm transition-colors duration-200 hover:text-amber-400" style={{ color: '#57534E' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: '#A8A29E' }}>Liên hệ</h4>
            <ul className="space-y-3">
              <li className="font-body text-sm" style={{ color: '#57534E' }}>Email: hotro@shopdv.vn</li>
              <li className="font-body text-sm" style={{ color: '#57534E' }}>Hotline: 0123.456.789</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="container-custom pb-8 text-center"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}
        >
          <p className="font-body text-xs" style={{ color: '#44403C' }}>
            © {new Date().getFullYear()} ShopDV. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
