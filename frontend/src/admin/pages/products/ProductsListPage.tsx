import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Plus, Edit2, Trash2,
  ChevronLeft, ChevronRight, Package, Star,
  ToggleLeft, ToggleRight, Loader, RefreshCw
} from 'lucide-react';
import { api } from '../../../services/api';

const SURFACE  = '#111118';
const SURFACE2 = '#1A1A25';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';
const PRIMARY  = '#6366F1';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price?: number;
  stock_count: number;
  sold_count: number;
  avg_rating?: number;
  is_active: boolean;
  is_featured: boolean;
}

const fmt = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const PAGE_SIZE = 10;

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/products', {
        params: { search: search || undefined }
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Lỗi khi xoá sản phẩm:", error);
      alert("Xoá sản phẩm thất bại.");
    }
  };

  const total = products.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paged = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: TEXT, fontFamily: "'Bodoni Moda', serif" }}>
            Quản lý sản phẩm
          </h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            Tổng cộng {total} sản phẩm
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg,#6366F1,#818CF8)',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
          }}
        >
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: MUTED }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm sản phẩm..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              color: TEXT,
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
          />
        </div>
        <button
          onClick={fetchProducts}
          className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200"
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: MUTED }}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Sản phẩm', 'Giá', 'Tồn kho', 'Đã bán', 'Đánh giá', 'Trạng thái', ''].map(h => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                    style={{ color: MUTED }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10" style={{ color: MUTED }}>
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" /> Đang tải danh sách...
                    </div>
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10" style={{ color: MUTED }}>
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : (
                paged.map((product, i) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="transition-colors duration-150"
                    style={{ borderBottom: i < paged.length - 1 ? `1px solid ${BORDER}` : 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = SURFACE2; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                  >
                    {/* Product name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(99,102,241,0.12)', color: PRIMARY }}
                        >
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold truncate max-w-[200px]" style={{ color: TEXT }}>
                            {product.name}
                          </p>
                          {product.is_featured && (
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                              style={{ background: 'rgba(202,138,4,0.15)', color: '#CA8A04' }}
                            >
                              Nổi bật
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold font-mono text-xs" style={{ color: '#22C55E' }}>
                          {fmt(product.sale_price ?? product.price)}
                        </p>
                        {product.sale_price && (
                          <p className="text-[11px] line-through font-mono" style={{ color: MUTED }}>
                            {fmt(product.price)}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: product.stock_count < 2 ? '#EF4444' : product.stock_count < 5 ? '#F59E0B' : '#22C55E' }}
                      >
                        {product.stock_count}
                      </span>
                    </td>

                    {/* Sold */}
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono" style={{ color: MUTED }}>{product.sold_count}</span>
                    </td>

                    {/* Rating */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold" style={{ color: '#FBBF24' }}>
                          {product.avg_rating || '5.0'}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold animate-none"
                        style={{
                          background: product.is_active ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                          color: product.is_active ? '#22C55E' : '#EF4444',
                        }}
                      >
                        {product.is_active
                          ? <ToggleRight className="w-3.5 h-3.5" />
                          : <ToggleLeft className="w-3.5 h-3.5" />
                        }
                        {product.is_active ? 'Hoạt động' : 'Ẩn'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
                          style={{ color: MUTED }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.12)'; (e.currentTarget as HTMLElement).style.color = PRIMARY; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = MUTED; }}
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
                          style={{ color: MUTED }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
                          title="Xoá"
                          aria-label="Xoá sản phẩm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderTop: `1px solid ${BORDER}` }}
          >
            <p className="text-xs" style={{ color: MUTED }}>
              Hiển thị {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} / {total} sản phẩm
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-30"
                style={{ background: SURFACE2, color: MUTED }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200"
                    style={{
                      background: page === p ? PRIMARY : SURFACE2,
                      color: page === p ? '#fff' : MUTED,
                    }}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-30"
                style={{ background: SURFACE2, color: MUTED }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
