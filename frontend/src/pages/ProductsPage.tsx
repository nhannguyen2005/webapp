import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import ProductCard from '../components/features/ProductCard';
import AnimatedPage from '../components/layout/AnimatedPage';
import type { Product } from '../types';
import { cn } from '../utils';
import { api } from '../services/api';

const ITEMS_PER_PAGE = 9;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('Mới nhất');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get('/products/');
        setProducts(response.data);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Dynamically extract categories from products
  const categoriesList = Array.from(
    new Set(products.map(p => p.category?.name).filter(Boolean))
  ) as string[];

  // Filtering logic
  const filteredProducts = products.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategories.length > 0 && p.category && !selectedCategories.includes(p.category.name)) return false;
    return true;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.sale_price || a.price;
    const priceB = b.sale_price || b.price;
    if (sortOrder === 'Giá thấp đến cao') return priceA - priceB;
    if (sortOrder === 'Giá cao đến thấp') return priceB - priceA;
    if (sortOrder === 'Bán chạy nhất') return b.sold_count - a.sold_count;
    return 0; // 'Mới nhất' default
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <AnimatedPage className="container-custom py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-textPrimary mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Tất cả sản phẩm
          </h1>
          <p className="text-gray-400">Hiển thị {paginatedProducts.length} trên tổng số {filteredProducts.length} sản phẩm</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/5 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20 outline-none transition-all"
              style={{ background: '#1C1917', color: '#fff' }}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>

          <Menu as="div" className="relative shrink-0">
            <MenuButton
              className="flex items-center gap-2 px-4 py-3 border border-white/5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-600/20 text-white"
              style={{ background: '#1C1917' }}
            >
              <span className="font-medium whitespace-nowrap text-xs">{sortOrder}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </MenuButton>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl shadow-lg focus:outline-none z-50 p-1 border border-white/5" style={{ background: '#1C1917' }}>
                {['Mới nhất', 'Bán chạy nhất', 'Giá thấp đến cao', 'Giá cao đến thấp'].map((option) => (
                  <MenuItem key={option}>
                    {({ active }) => (
                      <button
                        onClick={() => setSortOrder(option)}
                        className={cn(
                          active ? 'bg-yellow-600/10 text-yellow-600' : 'text-gray-200',
                          'group flex w-full items-center rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer'
                        )}
                      >
                        {option}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="p-6 rounded-3xl border border-white/5 sticky top-24" style={{ background: '#1C1917' }}>
            <div className="flex items-center gap-2 mb-6 text-white">
              <Filter className="w-5 h-5" />
              <h3 className="font-bold text-base">Bộ lọc</h3>
            </div>
            
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h4 className="font-semibold mb-3 text-xs" style={{ color: '#E7E5E4' }}>Danh mục</h4>
                <ul className="space-y-3">
                  {categoriesList.map(cat => (
                    <li key={cat}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-4 h-4">
                          <input 
                            type="checkbox" 
                            className="peer appearance-none w-4 h-4 border border-white/10 rounded checked:bg-yellow-600 checked:border-yellow-600 transition-all cursor-pointer"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                          />
                          <svg className="absolute w-2.5 h-2.5 text-black pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="font-semibold text-xs text-gray-300 group-hover:text-yellow-600 transition-colors">{cat}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Grid & Pagination */}
        <div className="flex-1 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-20 text-gray-400">
              <Loader className="w-8 h-8 animate-spin" />
              <span className="ml-2 text-xs font-semibold">Đang tải sản phẩm...</span>
            </div>
          ) : paginatedProducts.length > 0 ? (
            <motion.div 
              key={`${currentPage}-${searchQuery}-${sortOrder}-${selectedCategories.join(',')}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
            >
              {paginatedProducts.map(product => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 rounded-3xl border border-white/5 border-dashed" style={{ background: '#1C1917' }}>
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-xs text-gray-400">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategories([]); }}
                className="mt-6 px-5 py-2 bg-yellow-600/10 text-yellow-600 font-bold rounded-xl hover:bg-yellow-600 hover:text-black transition-colors text-xs cursor-pointer"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-auto">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-white/5 text-gray-400 hover:bg-yellow-600/10 hover:text-yellow-600 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-10 h-10 rounded-xl font-bold transition-colors cursor-pointer text-xs",
                      isActive 
                        ? "bg-yellow-600 text-black shadow-md" 
                        : "border border-white/5 text-gray-400 hover:bg-yellow-600/10 hover:text-yellow-600"
                    )}
                  >
                    {page}
                  </button>
                );
              })}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-white/5 text-gray-400 hover:bg-yellow-600/10 hover:text-yellow-600 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}
