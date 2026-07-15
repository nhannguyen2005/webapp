import React, { useState, useEffect } from 'react';
import {
  Search, ChevronLeft, ChevronRight, Mail, Calendar, Shield, Loader, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../../services/api';

const SURFACE  = '#111118';
const SURFACE2 = '#1A1A25';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';

const fmt = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  balance: number;
  is_active: boolean;
  created_at: string;
}

const AVATAR_COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#0EA5E9', '#EC4899'];
const PAGE_SIZE = 10;

export default function CustomersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users', {
        params: { search: search || undefined }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi tải người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const total = users.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paged = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: TEXT, fontFamily: "'Bodoni Moda', serif" }}>
            Quản lý khách hàng
          </h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>{total} khách hàng</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: MUTED }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm theo tên, email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
            style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
          />
        </div>
        <button
          onClick={fetchUsers}
          className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200"
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
                {['Khách hàng', 'Vai trò', 'Số dư ví', 'Ngày tham gia', 'Trạng thái', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10" style={{ color: MUTED }}>
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" /> Đang tải danh sách...
                    </div>
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10" style={{ color: MUTED }}>
                    Không có người dùng nào trùng khớp
                  </td>
                </tr>
              ) : (
                paged.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: i < paged.length - 1 ? `1px solid ${BORDER}` : 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = SURFACE2; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ background: AVATAR_COLORS[i % 5] + '22', color: AVATAR_COLORS[i % 5] }}
                        >
                          {c.username ? c.username[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: TEXT }}>{c.username}</p>
                          <div className="flex items-center gap-1 text-[11px]" style={{ color: MUTED }}>
                            <Mail className="w-3 h-3" />
                            {c.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
                        style={{
                          background: c.role === 'ADMIN' ? 'rgba(202,138,4,0.15)' : 'rgba(255,255,255,0.06)',
                          color: c.role === 'ADMIN' ? '#CA8A04' : MUTED,
                        }}
                      >
                        {c.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold font-mono text-xs" style={{ color: '#22C55E' }}>
                        {fmt(c.balance || 0)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
                        <Calendar className="w-3 h-3" />
                        {new Date(c.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{
                          background: c.is_active ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                          color: c.is_active ? '#22C55E' : '#EF4444',
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
                        {c.is_active ? 'Hoạt động' : 'Bị khoá'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
                        style={{ color: MUTED }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#818CF8'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
                      >
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
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
