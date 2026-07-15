import React from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/layout/AnimatedPage';

export default function ContactPage() {
  return (
    <AnimatedPage className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0F172A] text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/30 rounded-full filter blur-[100px] opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/20 rounded-full filter blur-[80px] opacity-60"></div>
        
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white">Liên hệ với chúng tôi</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              ShopDV luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7. Hãy gửi tin nhắn hoặc gọi điện trực tiếp để được giải đáp mọi thắc mắc.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 -mt-10 relative z-20">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="w-full lg:w-5/12 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-full"
              >
                <h3 className="text-2xl font-bold text-textPrimary mb-8">Thông tin liên hệ</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Trụ sở chính</h4>
                      <p className="text-gray-600 text-sm">123 Đường Công Nghệ, Phường Đổi Mới, Quận Sáng Tạo, TP. Hồ Chí Minh</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center text-success shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Hotline hỗ trợ</h4>
                      <p className="text-gray-600 text-sm">0123 456 789 (Zalo/Telegram)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Email</h4>
                      <p className="text-gray-600 text-sm">support@shopdv.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Giờ làm việc</h4>
                      <p className="text-gray-600 text-sm">Thứ 2 - Chủ nhật: 08:00 - 23:00</p>
                    </div>
                  </div>
                </div>

                {/* Social Media (Placeholders) */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-4">Kết nối với chúng tôi</h4>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4].map(i => (
                       <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
                         <span className="font-bold">S{i}</span>
                       </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-7/12">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-textPrimary mb-2">Gửi tin nhắn cho chúng tôi</h3>
                <p className="text-gray-600 mb-8 text-sm">Vui lòng điền thông tin bên dưới, chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-800">Họ và tên</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50 focus:bg-white" placeholder="Nguyễn Văn A" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-800">Số điện thoại</label>
                      <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50 focus:bg-white" placeholder="0912 345 678" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-800">Email</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50 focus:bg-white" placeholder="example@gmail.com" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-800">Nội dung tin nhắn</label>
                    <textarea 
                      rows={5} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50 focus:bg-white resize-none" 
                      placeholder="Bạn cần hỗ trợ về vấn đề gì..."
                    ></textarea>
                  </div>
                  
                  <button type="button" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all hover:-translate-y-1 text-lg flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Gửi yêu cầu
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
