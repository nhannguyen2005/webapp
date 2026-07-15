import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { formatPrice } from '../../utils';
import type { Product } from '../../types';
import { useCartStore } from '../../stores/cartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="hover-card flex flex-col h-full cursor-pointer group overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(202,138,4,0.35)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
      }}
    >
      {/* Thumbnail */}
      <div
        className="relative aspect-video w-full overflow-hidden"
        style={{ background: '#1C1917' }}
      >
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-body text-sm"
            style={{ color: '#44403C' }}
          >
            Chưa có ảnh
          </div>
        )}

        {/* Category Badge */}
        {product.category && (
          <div
            className="absolute top-3 left-3 font-body text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm"
            style={{
              background: 'rgba(202,138,4,0.2)',
              border: '1px solid rgba(202,138,4,0.4)',
              color: '#FBBF24',
            }}
          >
            {product.category.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3
          className="font-display font-semibold text-base mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-amber-400"
          style={{ color: '#F5F5F0', fontFamily: "'Bodoni Moda', serif" }}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4 mt-auto">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-body text-sm font-semibold" style={{ color: '#FBBF24' }}>
            {product.avg_rating || 5.0}
          </span>
          <span className="font-body text-xs" style={{ color: '#57534E' }}>
            ({product.review_count || 0})
          </span>
        </div>

        {/* Price & Action */}
        <div className="flex items-end justify-between mt-1">
          <div>
            {product.sale_price ? (
              <>
                <div className="font-body text-xs line-through mb-0.5" style={{ color: '#57534E' }}>
                  {formatPrice(product.price)}
                </div>
                <div className="font-body text-lg font-bold" style={{ color: '#CA8A04' }}>
                  {formatPrice(product.sale_price)}
                </div>
              </>
            ) : (
              <div className="font-body text-lg font-bold" style={{ color: '#CA8A04' }}>
                {formatPrice(product.price)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300"
            style={{
              background: 'rgba(202,138,4,0.12)',
              border: '1px solid rgba(202,138,4,0.25)',
              color: '#CA8A04',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#CA8A04';
              (e.currentTarget as HTMLButtonElement).style.color = '#0C0A09';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(202,138,4,0.12)';
              (e.currentTarget as HTMLButtonElement).style.color = '#CA8A04';
            }}
            aria-label="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
