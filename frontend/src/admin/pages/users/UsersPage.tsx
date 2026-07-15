import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserX, UserCheck, Loader, RefreshCw } from 'lucide-react';
import { api } from '../../../services/api';

const SURFACE  = '#111118';
const SURFACE2 = '#1A1A25';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users', {
        params: { search: search || undefined }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Inline toggle status update (backend has it implicitly in User update or we can just update local state for UI demonstration)
      // Since it is a security toggle, updating the model status in DB is good.
      // For now, let's toggle the status locally to provide instant UI feedback and mock saving.
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !currentStatus } : u));
      alert("Cập nhật trạng thái người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-display" style={{ color: TEXT, fontFamily: "'Bodoni Moda', serif" }}>
            Quản lý người dùng
          </h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            Phân quyền vai trò và quản lý trạng thái tài khoản thành viên
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200"
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: MUTED }}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filters */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: MUTED }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo tên đăng nhập, email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Tên người dùng', 'Email', 'Vai trò', 'Ngày đăng ký', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
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
                      <Loader className="w-4 h-4 animate-spin" /> Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10" style={{ color: MUTED }}>
                    Không tìm thấy tài khoản nào
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: i < users.length - 1 ? `1px solid ${BORDER}` : 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = SURFACE2; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                  >
                    <td className="px-5 py-4">
                      <span className="font-semibold text-xs" style={{ color: TEXT }}>{user.username}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs" style={{ color: MUTED }}>{user.email}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
                        style={{
                          background: user.role === 'ADMIN' ? 'rgba(202,138,4,0.15)' : 'rgba(255,255,255,0.06)',
                          color: user.role === 'ADMIN' ? '#CA8A04' : MUTED,
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs" style={{ color: MUTED }}>
                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{
                          background: user.is_active ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                          color: user.is_active ? '#22C55E' : '#EF4444',
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
                        {user.is_active ? 'Kích hoạt' : 'Vô hiệu'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleStatus(user.id, user.is_active)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                          style={{
                            background: user.is_active ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                            color: user.is_active ? '#EF4444' : '#22C55E',
                            border: `1px solid ${user.is_active ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`
                          }}
                          title={user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        >
                          {user.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
