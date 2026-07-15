import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../stores/cartStore';
import { formatPrice } from '../utils';
import AnimatedPage from '../components/layout/AnimatedPage';
import { cn } from '../utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  return (
    <AnimatedPage className="container-custom py-12 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-8 text-textPrimary">Giỏ hàng của bạn</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-3xl p-12 text-center border border-gray-100 border-dashed bg-white"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-600 mb-6 text-lg">Giỏ hàng của bạn đang trống.</p>
              <Link to="/products" className="inline-block bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-xl transition-all hover:shadow-lg">
                Tiếp tục mua sắm
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow items-center"
                  >
                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-2xl shrink-0 overflow-hidden relative">
                      {item.product.thumbnail && (
                        <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <Link to={`/products/${item.product.slug}`} className="font-bold text-lg hover:text-primary transition-colors line-clamp-2 mb-2">
                        {item.product.name}
                      </Link>
                      <div className="text-success font-black text-xl">
                        {formatPrice(item.product.sale_price || item.product.price)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-600"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >-</button>
                        <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-600"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >+</button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="text-gray-400 hover:text-danger hover:bg-red-50 p-3 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="glass-card rounded-3xl p-6 shadow-xl sticky top-24 border border-primary/10">
            <h3 className="font-extrabold text-xl mb-6 text-textPrimary">Tóm tắt đơn hàng</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700 font-medium">
                <span>Tạm tính</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-gray-700 font-medium">
                <span>Giảm giá</span>
                <span>0đ</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-800">Tổng cộng</span>
                <span className="text-success text-3xl font-black">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
            
            <Link 
              to="/checkout"
              className={cn(
                "w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl shadow-md transition-all",
                items.length > 0 
                  ? "bg-primary hover:bg-primary-hover text-white hover:-translate-y-1 hover:shadow-lg" 
                  : "bg-gray-100 text-gray-400 pointer-events-none"
              )}
            >
              Tiến hành thanh toán
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
