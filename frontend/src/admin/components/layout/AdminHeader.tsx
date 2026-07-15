import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Search, ChevronRight, X, Clock } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';

const BORDER = 'rgba(255,255,255,0.07)';
const SURFACE = '#111118';
const SURFACE2 = '#1A1A25';
const TEXT = '#F1F5F9';
const MUTED = '#64748B';

/* ── Breadcrumb helper ─────────────────────────────────────────── */
const CRUMB_MAP: Record<string, string> = {
  admin: 'Admin',
  products: 'Sản phẩm',
  orders: 'Đơn hàng',
  customers: 'Khách hàng',
  inventory: 'Kho hàng số',
  categories: 'Danh mục',
  reports: 'Thống kê',
  settings: 'Cài đặt',
  news: 'Tin tức',
  reviews: 'Đánh giá',
  users: 'Người dùng',
  new: 'Tạo mới',
  edit: 'Chỉnh sửa',
};

function useBreadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((seg, i) => ({
    label: CRUMB_MAP[seg] || seg,
    to: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));
}

export default function AdminHeader() {
  const breadcrumbs = useBreadcrumbs();
  const { user } = useAuthStore();

  // Search Modal State
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');

  // Notifications Popover State
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Đơn hàng #DV-2026 mới đang chờ thanh toán.', type: 'info', read: false },
    { id: 2, text: 'Tài khoản Netflix Premium trong kho còn dưới 3 cái.', type: 'warning', read: false },
    { id: 3, text: 'Giao tài khoản ChatGPT Plus tự động thành công.', type: 'success', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const navOptions = [
    { label: 'Quản lý sản phẩm', to: '/admin/products' },
    { label: 'Xem đơn hàng mới', to: '/admin/orders' },
    { label: 'Kiểm tra kho tài khoản', to: '/admin/inventory' },
    { label: 'Cấu hình cổng thanh toán', to: '/admin/settings' },
  ];

  const filteredNavs = navOptions.filter(opt =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <header
      className="flex items-center justify-between h-16 px-6 shrink-0 relative"
      style={{
        background: SURFACE,
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.to}>
            {i > 0 && (
              <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: MUTED }} />
            )}
            {crumb.isLast ? (
              <span className="font-semibold" style={{ color: TEXT }}>
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.to}
                className="transition-colors duration-200 hover:text-indigo-400 cursor-pointer"
                style={{ color: MUTED }}
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-2 relative">
        {/* Search Toggle Button */}
        <button
          onClick={() => setShowSearch(true)}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm cursor-pointer transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: MUTED,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.4)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
          aria-label="Tìm kiếm nhanh"
        >
          <Search className="w-4 h-4" />
          <span className="text-xs">Tìm nhanh...</span>
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(v => !v)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: showNotif ? TEXT : MUTED,
            }}
            onMouseEnter={e => { if (!showNotif) (e.currentTarget as HTMLButtonElement).style.color = TEXT; }}
            onMouseLeave={e => { if (!showNotif) (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
            aria-label="Xem thông báo"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: '#EF4444' }}
              />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotif && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
              <div
                className="absolute right-0 mt-2 w-80 rounded-2xl p-4 shadow-xl z-50 space-y-3"
                style={{
                  background: SURFACE2,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: BORDER }}>
                  <span className="text-xs font-bold" style={{ color: TEXT }}>Thông báo ({unreadCount})</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-semibold hover:text-indigo-400 cursor-pointer"
                      style={{ color: '#818CF8' }}
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl text-xs space-y-1 relative"
                      style={{
                        background: n.read ? 'transparent' : 'rgba(255,255,255,0.03)',
                        borderLeft: `3px solid ${n.type === 'warning' ? '#F59E0B' : n.type === 'success' ? '#22C55E' : '#6366F1'}`
                      }}
                    >
                      <p style={{ color: TEXT }}>{n.text}</p>
                      <div className="flex items-center gap-1" style={{ color: MUTED }}>
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px]">Vừa xong</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-default"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'rgba(99,102,241,0.2)', color: '#818CF8' }}
          >
            {user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <span className="hidden md:block text-xs font-medium" style={{ color: TEXT }}>
            {user?.username || 'Admin'}
          </span>
        </div>
      </div>

      {/* Search Modal Overlay */}
      {showSearch && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowSearch(false); }}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-5 shadow-2xl space-y-4"
            style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 border-b pb-3" style={{ borderColor: BORDER }}>
              <Search className="w-5 h-5" style={{ color: MUTED }} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Nhập tên trang hoặc sản phẩm cần tìm..."
                className="w-full text-sm bg-transparent outline-none"
                style={{ color: TEXT }}
              />
              <button
                onClick={() => { setShowSearch(false); setQuery(''); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10"
                style={{ color: MUTED }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results Grid */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Định hướng nhanh</p>
              {filteredNavs.length === 0 ? (
                <p className="text-xs py-2" style={{ color: MUTED }}>Không tìm thấy trang quản trị trùng khớp.</p>
              ) : (
                filteredNavs.map(nav => (
                  <Link
                    key={nav.to}
                    to={nav.to}
                    onClick={() => { setShowSearch(false); setQuery(''); }}
                    className="flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer hover:bg-white/5 group transition-all"
                  >
                    <span style={{ color: TEXT }}>{nav.label}</span>
                    <span className="text-[10px]" style={{ color: '#818CF8' }}>Truy cập →</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
