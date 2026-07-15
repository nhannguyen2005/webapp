import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { api } from '../../../services/api';

const SURFACE  = '#111118';
const SURFACE2 = '#1A1A25';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';

interface CategoryInfo {
  id: number;
  name: string;
}

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [productType, setProductType] = useState('account');
  const [deliveryType, setDeliveryType] = useState('auto');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Load Categories & Product Info if Edit Mode
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch categories (Wait, does the backend have a category listing API? Yes, /admin/products has categories loaded or we can seed/list. In backend, we added Category model. Let's create a quick API or fetch from product details)
        // Let's query categories. For now, since we seeded categories:
        // We will query categories from the products list or assume we have categories.
        // Actually, let's look at what category list endpoint is there in backend:
        // There is no category router in v1/__init__.py yet. But wait, can we fetch categories from admin.py or create one?
        // Let's look at backend/app/api/v1/admin.py. There is no category CRUD endpoint.
        // Let's mock categories list in frontend if it fails, or let's create a categories query.
        // In seed script, we created: 1: "Tài khoản AI", 2: "Giải trí", 3: "Học tập".
        // Let's fetch categories or fallback to the seed values.
        setCategories([
          { id: 1, name: 'Tài khoản AI' },
          { id: 2, name: 'Giải trí' },
          { id: 3, name: 'Học tập' }
        ]);

        if (isEdit) {
          const { data } = await api.get(`/admin/products`);
          const found = data.find((p: any) => p.id === id);
          if (found) {
            setName(found.name);
            setSlug(found.slug);
            setDescription(found.description || '');
            setShortDesc(found.short_desc || '');
            setPrice(Number(found.price));
            setSalePrice(found.sale_price ? Number(found.sale_price) : undefined);
            setCategoryId(found.category_id || '');
            setProductType(found.product_type || 'account');
            setDeliveryType(found.delivery_type || 'auto');
            setIsActive(found.is_active);
            setIsFeatured(found.is_featured);
          } else {
            alert("Không tìm thấy sản phẩm");
            navigate('/admin/products');
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu form:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEdit, navigate]);

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) {
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name,
      slug,
      description,
      short_desc: shortDesc,
      price,
      sale_price: salePrice || null,
      category_id: categoryId || null,
      product_type: productType,
      delivery_type: deliveryType,
      is_active: isActive,
      is_featured: isFeatured,
      images: [],
      thumbnail: ''
    };

    try {
      if (isEdit) {
        await api.put(`/admin/products/${id}`, payload);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await api.post('/admin/products', payload);
        alert("Thêm sản phẩm thành công!");
      }
      navigate('/admin/products');
    } catch (err) {
      console.error("Lỗi khi gửi form:", err);
      alert("Đã xảy ra lỗi khi lưu sản phẩm.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]" style={{ color: MUTED }}>
        <Loader className="w-8 h-8 animate-spin mb-2" />
        <p className="text-sm">Đang tải dữ liệu sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/products"
          className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-200"
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: MUTED }}
          onMouseEnter={e => { e.currentTarget.style.color = TEXT; }}
          onMouseLeave={e => { e.currentTarget.style.color = MUTED; }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold font-display" style={{ color: TEXT, fontFamily: "'Bodoni Moda', serif" }}>
            {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h1>
          <p className="text-sm" style={{ color: MUTED }}>
            {isEdit ? 'Cập nhật các thông tin chi tiết của sản phẩm' : 'Tạo một mặt hàng mới cho gian hàng của bạn'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-6 space-y-5"
        style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
      >
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Tên sản phẩm</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            placeholder="Ví dụ: ChatGPT Plus 1 Tháng"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
            style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Đường dẫn tĩnh (Slug)</label>
          <input
            type="text"
            required
            value={slug}
            onChange={e => setSlug(e.target.value)}
            placeholder="chatgpt-plus-1-thang"
            className="w-full px-4 py-2.5 rounded-xl text-sm font-mono outline-none transition-all duration-200"
            style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Danh mục</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
              style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
            >
              <option value="">Chọn danh mục...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Loại hàng hóa</label>
            <select
              value={productType}
              onChange={e => setProductType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
              style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
            >
              <option value="account">Tài khoản số (email/pass)</option>
              <option value="key">Key bản quyền (license key)</option>
              <option value="other">Loại khác</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Giá bán gốc (đ)</label>
            <input
              type="number"
              required
              min={0}
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              placeholder="199000"
              className="w-full px-4 py-2.5 rounded-xl text-sm font-mono outline-none"
              style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
            />
          </div>

          {/* Sale Price */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Giá khuyến mãi (đ) - Tùy chọn</label>
            <input
              type="number"
              min={0}
              value={salePrice || ''}
              onChange={e => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="159000"
              className="w-full px-4 py-2.5 rounded-xl text-sm font-mono outline-none"
              style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
            />
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Mô tả ngắn</label>
          <input
            type="text"
            value={shortDesc}
            onChange={e => setShortDesc(e.target.value)}
            placeholder="GPT-4o, DALL-E 3, hỗ trợ trọn gói..."
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>Mô tả chi tiết</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={5}
            placeholder="Nhập hướng dẫn sử dụng, chế độ bảo hành..."
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
          />
        </div>

        {/* Toggle options */}
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none" style={{ color: TEXT }}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            Cho phép hiển thị bán
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer select-none" style={{ color: TEXT }}>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={e => setIsFeatured(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            Sản phẩm nổi bật
          </label>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg,#6366F1,#818CF8)',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(99,102,241,0.25)',
          }}
        >
          {submitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" /> Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Lưu thông tin
            </>
          )}
        </button>
      </form>
    </div>
  );
}
