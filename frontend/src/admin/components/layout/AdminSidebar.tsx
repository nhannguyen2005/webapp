import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Archive,
  Settings, ChevronLeft, ChevronRight, LogOut,
  BarChart3, Tag, MessageSquare, FileText, Shield,
} from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';

/* ── Design Tokens ─────────────────────────────────────────────── */
const SURFACE   = '#111118';
const SURFACE2  = '#1A1A25';
const BORDER    = 'rgba(255,255,255,0.07)';
const TEXT      = '#F1F5F9';
const MUTED     = '#64748B';
const PRIMARY   = '#6366F1';
const PRIMARY_L = 'rgba(99,102,241,0.12)';

/* ── Nav items ─────────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    group: 'Tổng quan',
    items: [
      { label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, to: '/admin' },
      { label: 'Thống kê', icon: <BarChart3 className="w-4 h-4" />, to: '/admin/reports' },
    ],
  },
  {
    group: 'Quản lý',
    items: [
      { label: 'Sản phẩm', icon: <Package className="w-4 h-4" />, to: '/admin/products' },
      { label: 'Kho hàng số', icon: <Archive className="w-4 h-4" />, to: '/admin/inventory' },
      { label: 'Danh mục', icon: <Tag className="w-4 h-4" />, to: '/admin/categories' },
      { label: 'Đơn hàng', icon: <ShoppingCart className="w-4 h-4" />, to: '/admin/orders' },
      { label: 'Khách hàng', icon: <Users className="w-4 h-4" />, to: '/admin/customers' },
    ],
  },
  {
    group: 'Nội dung',
    items: [
      { label: 'Tin tức / CMS', icon: <FileText className="w-4 h-4" />, to: '/admin/news' },
      { label: 'Đánh giá', icon: <MessageSquare className="w-4 h-4" />, to: '/admin/reviews' },
    ],
  },
  {
    group: 'Hệ thống',
    items: [
      { label: 'Người dùng', icon: <Shield className="w-4 h-4" />, to: '/admin/users' },
      { label: 'Cài đặt', icon: <Settings className="w-4 h-4" />, to: '/admin/settings' },
    ],
  },
];

/* ── Component ─────────────────────────────────────────────────── */
interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  return (
    <aside
      className="flex flex-col h-full transition-all duration-300 shrink-0"
      style={{
        width: collapsed ? 64 : 240,
        background: SURFACE,
        borderRight: `1px solid ${BORDER}`,
      }}
    >
      {/* Logo + Toggle */}
      <div
        className="flex items-center justify-between px-4 h-16 shrink-0"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        {!collapsed && (
          <Link
            to="/admin"
            className="font-bold text-lg tracking-tight cursor-pointer"
            style={{
              fontFamily: "'Bodoni Moda', serif",
              background: 'linear-gradient(135deg,#6366F1,#818CF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ShopDV Admin
          </Link>
        )}
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ml-auto"
          style={{ color: MUTED, background: SURFACE2 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = TEXT; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
          aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {NAV_ITEMS.map(group => (
          <div key={group.group} className="mb-4">
            {!collapsed && (
              <p
                className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: MUTED }}
              >
                {group.group}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map(item => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/admin'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium group ${
                        isActive ? 'active-nav' : ''
                      }`
                    }
                    style={({ isActive }) => ({
                      background: isActive ? PRIMARY_L : 'transparent',
                      color: isActive ? '#818CF8' : MUTED,
                      ...(collapsed ? { justifyContent: 'center' } : {}),
                    })}
                    title={collapsed ? item.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className="shrink-0 transition-colors"
                          style={{ color: isActive ? PRIMARY : 'inherit' }}
                        >
                          {item.icon}
                        </span>
                        {!collapsed && <span className="truncate">{item.label}</span>}
                        {!collapsed && isActive && (
                          <span
                            className="ml-auto w-1.5 h-1.5 rounded-full"
                            style={{ background: PRIMARY }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="px-2 pb-4 pt-2 shrink-0"
      style={{ borderTop: `1px solid ${BORDER}` }}
    >
      {!collapsed ? (
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: SURFACE2 }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: 'rgba(99,102,241,0.2)', color: '#818CF8' }}
          >
            {user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: TEXT }}>{user?.username || 'Admin'}</p>
            <p className="text-[10px] truncate" style={{ color: MUTED }}>{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{ color: MUTED }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
            aria-label="Đăng xuất"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogout}
          className="w-full flex justify-center py-2 cursor-pointer transition-all duration-200 rounded-xl"
          style={{ color: MUTED }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
          aria-label="Đăng xuất"
        >
          <LogOut className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
