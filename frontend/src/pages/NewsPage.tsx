import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedPage from '../components/layout/AnimatedPage';

// Dummy blog data
const featuredPost = {
  id: 1,
  title: 'Top 5 công cụ AI đáng mua nhất năm 2026 cho dân văn phòng',
  excerpt: 'Khám phá ngay danh sách 5 nền tảng trí tuệ nhân tạo (AI) giúp bạn tự động hóa công việc, tăng hiệu suất gấp 3 lần và tiết kiệm hàng chục giờ mỗi tuần.',
  category: 'Công nghệ',
  date: '14 Tháng 07, 2026',
  author: 'Admin',
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200&h=600'
};

// Generate 12 dummy posts
const allPosts = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 2,
  title: `Bài viết mẫu về Thủ thuật phần mềm phần ${i + 1}`,
  excerpt: 'Đây là đoạn trích dẫn mô tả ngắn gọn về nội dung bài viết. Bài viết này sẽ hướng dẫn bạn các tính năng thú vị và cách tối ưu hóa công việc.',
  category: i % 3 === 0 ? 'Thủ thuật' : i % 3 === 1 ? 'Đánh giá' : 'Thông báo',
  date: `${28 - (i * 2)} Tháng 06, 2026`,
  image: `https://images.unsplash.com/photo-${1574375927938 + i}?auto=format&fit=crop&q=80&w=600&h=400`
}));

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = allPosts.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  return (
    <AnimatedPage className="bg-background min-h-screen pb-20">
      {/* Header */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-textPrimary mb-4">Tin tức & Thủ thuật</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Cập nhật những tin tức công nghệ mới nhất, mẹo hay sử dụng tài khoản bản quyền và các chương trình khuyến mãi.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom mt-12">
        {/* Featured Post */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16 group cursor-pointer"
        >
          <div className="glass-card bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col md:flex-row hover:shadow-xl transition-shadow">
            <div className="w-full md:w-3/5 aspect-video md:aspect-auto relative overflow-hidden bg-gray-200">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-lg font-bold text-sm text-primary shadow-sm">
                {featuredPost.category}
              </div>
            </div>
            <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-sm text-gray-600 font-medium mb-4">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {featuredPost.date}</span>
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {featuredPost.author}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-textPrimary mb-4 group-hover:text-primary transition-colors leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                {featuredPost.excerpt}
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                  Đọc tiếp <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Posts Grid */}
        <h3 className="text-2xl font-bold text-textPrimary mb-8">Bài viết mới nhất</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
          {paginatedPosts.map((post, index) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className="glass-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all group cursor-pointer flex flex-col h-full"
            >
              <div className="w-full aspect-video bg-gray-200 relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400'; }}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-md font-bold text-xs text-primary">
                  {post.category}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </div>
                <h4 className="font-bold text-lg text-textPrimary mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-50">
                  <span className="text-sm font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Xem chi tiết <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Real Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all border border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button 
                  key={page} 
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${
                    page === currentPage 
                      ? 'bg-primary text-white shadow-md' 
                      : 'border border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all border border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
