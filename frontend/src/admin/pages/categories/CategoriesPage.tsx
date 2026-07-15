import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, Plus, Trash2, Loader, RefreshCw } from 'lucide-react';
import { api } from '../../../services/api';

const SURFACE  = '#111118';
const SURFACE2 = '#1A1A25';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/([^0-9a-z-\s])/g, '')
        .replace(/(\s+)/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const response = await api.post('/admin/categories', {
        name,
        slug,
        description: description || null
      });
      setCategories(prev => [...prev, response.data]);
      setName('');
      setSlug('');
      setDescription('');
      alert("Tạo danh mục thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo danh mục:", error);
      alert("Tạo danh mục thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá danh mục này? Tất cả sản phẩm thuộc danh mục sẽ bị ảnh hưởng.")) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
      alert("Xoá danh mục thành công!");
    } catch (error) {
      console.error("Lỗi khi xoá danh mục:", error);
      alert("Xoá danh mục thất bại.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-display" style={{ color: TEXT, fontFamily: "'Bodoni Moda', serif" }}>
            Quản lý danh mục
          </h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            Quản lý các danh mục phân loại sản phẩm trên hệ thống
          </p>
        </div>
        <button
          onClick={fetchCategories}
          className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200"
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: MUTED }}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Create Form */}
        <div className="space-y-4">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-5 space-y-4"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <h3 className="font-bold text-sm" style={{ color: TEXT }}>Tạo danh mục mới</h3>

            <div>
              <label className="block text-[11px] font-semibold mb-1" style={{ color: MUTED }}>Tên danh mục</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="Ví dụ: Tài khoản học tập"
                className="w-full px-3 py-2 rounded-xl text-xs outline-none"
                style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1" style={{ color: MUTED }}>Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="tai-khoan-hoc-tap"
                className="w-full px-3 py-2 rounded-xl text-xs font-mono outline-none"
                style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1" style={{ color: MUTED }}>Mô tả danh mục</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Nhập mô tả ngắn..."
                className="w-full px-3 py-2 rounded-xl text-xs outline-none resize-none"
                style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl font-semibold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff' }}
            >
              {submitting ? (
                <>
                  <Loader className="w-3.5 h-3.5 animate-spin" /> Đang tạo...
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Tạo danh mục
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Category List */}
        <div className="md:col-span-2 space-y-4">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase" style={{ color: MUTED }}>Danh mục</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase" style={{ color: MUTED }}>Slug</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase" style={{ color: MUTED }}>Mô tả</th>
                    <th className="text-right px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-10" style={{ color: MUTED }}>
                        <div className="flex items-center justify-center gap-2">
                          <Loader className="w-4 h-4 animate-spin" /> Đang tải danh mục...
                        </div>
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-10" style={{ color: MUTED }}>
                        Chưa có danh mục nào trên hệ thống
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat, i) => (
                      <motion.tr
                        key={cat.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        style={{ borderBottom: i < categories.length - 1 ? `1px solid ${BORDER}` : 'none' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = SURFACE2; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5" style={{ color: '#6366F1' }} />
                            <span className="font-semibold text-xs" style={{ color: TEXT }}>{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs" style={{ color: MUTED }}>{cat.slug}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs truncate max-w-[200px] block" style={{ color: MUTED }}>{cat.description || '—'}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
                            style={{ color: MUTED }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
