import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Edit, Trash2, Calendar, User } from 'lucide-react';

const SURFACE  = '#111118';
const SURFACE2 = '#1A1A25';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';

interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  author: string;
  status: 'published' | 'draft';
}

const MOCK_ARTICLES: Article[] = [
  { id: 1, title: 'Top 5 công cụ AI đáng mua nhất năm 2026 cho dân văn phòng', category: 'Công nghệ', date: '14/07/2026', author: 'Admin', status: 'published' },
  { id: 2, title: 'Cách tự động gia hạn gói Netflix Premium gia đình', category: 'Thủ thuật', date: '12/07/2026', author: 'Admin', status: 'published' },
  { id: 3, title: 'Sử dụng Canva Pro thiết kế ảnh thương mại điện tử chuyên nghiệp', category: 'Thiết kế', date: '10/07/2026', author: 'Admin', status: 'draft' },
  { id: 4, title: 'Chính sách bảo hành 1 đổi 1 và nâng cấp tài khoản tự động tại ShopDV', category: 'Thông báo', date: '08/07/2026', author: 'Admin', status: 'published' },
];

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);

  const handleDelete = (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá bài viết này?")) return;
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" style={{ color: '#6366F1' }} />
          <div>
            <h1 className="text-xl font-bold font-display" style={{ color: TEXT, fontFamily: "'Bodoni Moda', serif" }}>
              Tin tức / CMS
            </h1>
            <p className="text-sm mt-0.5" style={{ color: MUTED }}>
              Tạo bài viết quảng cáo, cẩm nang sử dụng tài khoản và bài đăng thông báo
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200"
          style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff' }}
        >
          <Plus className="w-4 h-4" />
          Viết bài mới
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Bài viết', 'Danh mục', 'Tác giả', 'Trạng thái', 'Ngày đăng', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map((art, i) => (
                <motion.tr
                  key={art.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: i < articles.length - 1 ? `1px solid ${BORDER}` : 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = SURFACE2; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                >
                  <td className="px-5 py-4">
                    <span className="font-semibold text-xs truncate max-w-[320px] block" style={{ color: TEXT }}>{art.title}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs" style={{ color: MUTED }}>{art.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
                      <User className="w-3.5 h-3.5" />
                      {art.author}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded font-bold"
                      style={{
                        background: art.status === 'published' ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
                        color: art.status === 'published' ? '#22C55E' : MUTED,
                      }}
                    >
                      {art.status === 'published' ? 'Công khai' : 'Nháp'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
                      <Calendar className="w-3.5 h-3.5" />
                      {art.date}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1.5">
                      <button
                        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                        style={{ color: MUTED }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#818CF8'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(art.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                        style={{ color: MUTED }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
