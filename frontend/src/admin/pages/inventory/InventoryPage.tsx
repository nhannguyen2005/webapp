import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Archive, Key, Eye, EyeOff,
  CheckCircle, XCircle, ChevronLeft, ChevronRight, Upload,
  Loader, RefreshCw
} from 'lucide-react';
import { api } from '../../../services/api';

const SURFACE  = '#111118';
const SURFACE2 = '#1A1A25';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';

interface DigitalAccount {
  id: string;
  product_id: string;
  product_name: string;
  email: string;
  password: string;
  status: 'available' | 'sold' | 'expired' | 'disabled';
  purchase_price: number;
  expiry_date?: string;
  created_at: string;
}

interface ProductInfo {
  id: string;
  name: string;
}

const STATUS_CONFIG = {
  available: { label: 'Có sẵn', color: '#22C55E', Icon: CheckCircle },
  sold:      { label: 'Đã bán', color: '#6366F1', Icon: Archive },
  expired:   { label: 'Hết hạn', color: '#EF4444', Icon: XCircle },
  disabled:  { label: 'Vô hiệu', color: MUTED, Icon: XCircle },
} as const;

const PAGE_SIZE = 12;

export default function InventoryPage() {
  const [accounts, setAccounts] = useState<DigitalAccount[]>([]);
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Filtering
  const [selectedProduct, setSelectedProduct] = useState('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [page, setPage] = useState(1);
  const [revealId, setRevealId] = useState<string | null>(null);

  // Bulk Modal
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkProductId, setBulkProductId] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [bulkPrice, setBulkPrice] = useState(0);
  const [importing, setImporting] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [invRes, prodRes] = await Promise.all([
        api.get('/admin/inventory'),
        api.get('/admin/products')
      ]);
      setAccounts(invRes.data);
      setProducts(prodRes.data);
      if (prodRes.data.length > 0 && !bulkProductId) {
        setBulkProductId(prodRes.data[0].id);
      }
    } catch (error) {
      console.error("Lỗi khi tải kho hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleBulkImport = async () => {
    if (!bulkProductId) {
      alert("Vui lòng chọn sản phẩm.");
      return;
    }
    if (!bulkText.trim()) {
      alert("Vui lòng điền thông tin tài khoản.");
      return;
    }

    setImporting(true);
    try {
      await api.post('/admin/inventory/bulk', {
        product_id: bulkProductId,
        items_text: bulkText,
        purchase_price: bulkPrice
      });
      alert("Nhập kho hàng loạt thành công!");
      setShowBulkModal(false);
      setBulkText('');
      fetchInventory();
    } catch (error) {
      console.error("Lỗi khi nhập kho:", error);
      alert("Nhập kho thất bại.");
    } finally {
      setImporting(false);
    }
  };

  // Filter accounts
  const filtered = accounts.filter(item => {
    const matchSearch = item.email.toLowerCase().includes(search.toLowerCase());
    const matchProduct = selectedProduct === 'Tất cả' || item.product_name === selectedProduct;
    const matchStatus = selectedStatus === 'Tất cả' || item.status === selectedStatus;
    return matchSearch && matchProduct && matchStatus;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Compute status summary from original accounts list
  const counts = accounts.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: TEXT, fontFamily: "'Bodoni Moda', serif" }}>
            Kho hàng số
          </h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>{total} tài khoản</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200"
            style={{
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.25)',
              color: '#22C55E',
            }}
          >
            <Upload className="w-4 h-4" />
            Nhập hàng loạt
          </button>
        </div>
      </div>

      {/* Summary strip */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl"
        style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
      >
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: cfg.color + '18', color: cfg.color }}>
              <cfg.Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-lg leading-none font-mono" style={{ color: TEXT, fontFamily: "'Fira Code', monospace" }}>
                {counts[key] || 0}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>{cfg.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: MUTED }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm email tài khoản..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
              style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
            />
          </div>
          <button
            onClick={fetchInventory}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: MUTED }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Product filter */}
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => { setSelectedProduct('Tất cả'); setPage(1); }}
            className="px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all"
            style={{
              background: selectedProduct === 'Tất cả' ? 'rgba(99,102,241,0.15)' : SURFACE,
              border: `1px solid ${selectedProduct === 'Tất cả' ? 'rgba(99,102,241,0.4)' : BORDER}`,
              color: selectedProduct === 'Tất cả' ? '#818CF8' : MUTED,
            }}
          >Tất cả sản phẩm</button>
          {products.map(p => (
            <button key={p.id} onClick={() => { setSelectedProduct(p.name); setPage(1); }}
              className="px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all"
              style={{
                background: selectedProduct === p.name ? 'rgba(99,102,241,0.15)' : SURFACE,
                border: `1px solid ${selectedProduct === p.name ? 'rgba(99,102,241,0.4)' : BORDER}`,
                color: selectedProduct === p.name ? '#818CF8' : MUTED,
              }}
            >{p.name}</button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => { setSelectedStatus('Tất cả'); setPage(1); }}
            className="px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all"
            style={{
              background: selectedStatus === 'Tất cả' ? 'rgba(99,102,241,0.15)' : SURFACE,
              border: `1px solid ${selectedStatus === 'Tất cả' ? 'rgba(99,102,241,0.4)' : BORDER}`,
              color: selectedStatus === 'Tất cả' ? '#818CF8' : MUTED,
            }}
          >Tất cả trạng thái</button>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <button key={key} onClick={() => { setSelectedStatus(key); setPage(1); }}
              className="px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all"
              style={{
                background: selectedStatus === key ? cfg.color + '18' : SURFACE,
                border: `1px solid ${selectedStatus === key ? cfg.color + '40' : BORDER}`,
                color: selectedStatus === key ? cfg.color : MUTED,
              }}
            >{cfg.label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Sản phẩm', 'Email tài khoản', 'Mật khẩu', 'Giá nhập', 'Hạn sử dụng', 'Trạng thái', 'Ngày thêm'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>
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
                      <Loader className="w-4 h-4 animate-spin" /> Đang tải kho hàng...
                    </div>
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10" style={{ color: MUTED }}>
                    Không có tài khoản nào tương thích
                  </td>
                </tr>
              ) : (
                paged.map((item, i) => {
                  const cfg = STATUS_CONFIG[item.status] || { label: item.status, color: MUTED, Icon: XCircle };
                  const { label, color, Icon } = cfg;
                  const revealed = revealId === item.id;
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      style={{ borderBottom: i < paged.length - 1 ? `1px solid ${BORDER}` : 'none' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = SURFACE2; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Key className="w-3.5 h-3.5 shrink-0" style={{ color: '#6366F1' }} />
                          <span className="text-xs font-medium truncate max-w-[140px]" style={{ color: TEXT }}>{item.product_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs" style={{ color: MUTED }}>{item.email}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs" style={{ color: revealed ? TEXT : MUTED }}>
                            {revealed ? item.password : '••••••••••'}
                          </span>
                          <button
                            onClick={() => setRevealId(revealed ? null : item.id)}
                            className="cursor-pointer transition-colors duration-150"
                            style={{ color: MUTED }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = TEXT; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
                          >
                            {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs" style={{ color: '#F59E0B' }}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.purchase_price)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs" style={{ color: item.status === 'expired' ? '#EF4444' : MUTED }}>
                          {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: color + '18', color }}>
                          <Icon className="w-3 h-3 animate-none" />
                          {label}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs" style={{ color: MUTED }}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: `1px solid ${BORDER}` }}>
            <p className="text-xs" style={{ color: MUTED }}>
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} / {total}
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

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowBulkModal(false); }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg rounded-2xl p-6"
            style={{ background: '#111118', border: `1px solid ${BORDER}` }}
          >
            <h2 className="font-bold text-lg mb-1" style={{ color: TEXT }}>Nhập tài khoản hàng loạt</h2>
            <p className="text-sm mb-4" style={{ color: MUTED }}>Mỗi dòng: email|password|2fa (tuỳ chọn)</p>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>Sản phẩm áp dụng</label>
                <select
                  value={bulkProductId}
                  onChange={e => setBulkProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>Giá nhập (đ/tài khoản)</label>
                <input
                  type="number"
                  value={bulkPrice}
                  onChange={e => setBulkPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none font-mono"
                  style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>Danh sách tài khoản</label>
                <textarea
                  value={bulkText}
                  onChange={e => setBulkText(e.target.value)}
                  rows={6}
                  placeholder={`acc1@gmail.com|MậtKhẩu1\nacc2@gmail.com|MậtKhẩu2|2FA_CODE`}
                  className="w-full px-3 py-2 rounded-xl text-sm font-mono outline-none resize-none"
                  style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all"
                style={{ background: SURFACE2, color: MUTED, border: `1px solid ${BORDER}` }}
              >
                Huỷ
              </button>
              <button
                onClick={handleBulkImport}
                disabled={importing}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff' }}
              >
                {importing && <Loader className="w-3.5 h-3.5 animate-spin" />}
                Nhập {bulkText.split('\n').filter(l => l.trim()).length} tài khoản
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
