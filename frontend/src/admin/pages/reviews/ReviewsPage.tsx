import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Check, Trash2 } from 'lucide-react';

const SURFACE  = '#111118';
const SURFACE2 = '#1A1A25';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';

interface Review {
  id: number;
  product: string;
  user: string;
  rating: number;
  comment: string;
  is_approved: boolean;
}

const MOCK_REVIEWS: Review[] = [
  { id: 1, product: 'ChatGPT Plus (GPT-4o)', user: 'Nguyễn Văn A', rating: 5, comment: 'Giao tài khoản rất nhanh, tài khoản sử dụng ổn định mượt mà.', is_approved: true },
  { id: 2, product: 'Netflix Premium 4K', user: 'Trần Thị B', rating: 4, comment: 'Chất lượng nét, tuy nhiên profile đôi lúc bị full thiết bị, admin rep hỗ trợ nhanh.', is_approved: true },
  { id: 3, product: 'Canva Pro 1 năm', user: 'Lê Văn C', rating: 5, comment: 'Nâng cấp nhanh chỉ mất 2 phút. Dùng rất tốt.', is_approved: false },
  { id: 4, product: 'Spotify Premium', user: 'Phạm Thị D', rating: 3, comment: 'Tài khoản thi thoảng bị lỗi premium, chờ hỗ trợ hơi lâu.', is_approved: false },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  const handleApprove = (id: number) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, is_approved: true } : r));
    alert("Đã duyệt đánh giá của khách hàng!");
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá đánh giá này?")) return;
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5" style={{ color: '#6366F1' }} />
        <div>
          <h1 className="text-xl font-bold font-display" style={{ color: TEXT, fontFamily: "'Bodoni Moda', serif" }}>
            Quản lý đánh giá
          </h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            Duyệt hoặc ẩn bình luận và xếp hạng sao từ người mua hàng
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Khách hàng', 'Sản phẩm', 'Xếp hạng', 'Nội dung bình luận', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: MUTED }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.map((rev, i) => (
                <motion.tr
                  key={rev.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: i < reviews.length - 1 ? `1px solid ${BORDER}` : 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = SURFACE2; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                >
                  <td className="px-5 py-4">
                    <span className="font-semibold text-xs" style={{ color: TEXT }}>{rev.user}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium" style={{ color: MUTED }}>{rev.product}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3.5 h-3.5 ${starIdx < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs italic max-w-[280px] block truncate" style={{ color: TEXT }}>
                      "{rev.comment}"
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                      style={{
                        background: rev.is_approved ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                        color: rev.is_approved ? '#22C55E' : '#F59E0B',
                      }}
                    >
                      {rev.is_approved ? 'Đã duyệt' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      {!rev.is_approved && (
                        <button
                          onClick={() => handleApprove(rev.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                          style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
                          title="Duyệt"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}
                        title="Xoá"
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
