# ShopDV - Ứng Dụng Thương Mại Điện Tử Toàn Diện

> Một nền tảng thương mại điện tử hiện đại, được xây dựng bằng công nghệ web stack tiên tiến với hệ thống quản lý toàn diện dành cho người bán hàng.

## 📋 Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Tính Năng Chính](#tính-năng-chính)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Hướng Dẫn Cài Đặt](#hướng-dẫn-cài-đặt)
- [Hướng Dẫn Phát Triển](#hướng-dẫn-phát-triển)
- [Cấu Hình Biến Môi Trường](#cấu-hình-biến-môi-trường)
- [API Documentation](#api-documentation)
- [Đóng Góp](#đóng-góp)
- [Giấy Phép](#giấy-phép)

## 🎯 Giới Thiệu

**ShopDV** là một ứng dụng thương mại điện tử hoàn chỉnh được thiết kế để đáp ứng nhu cầu của cả khách hàng và người quản lý cửa hàng. Ứng dụng cung cấp giao diện người dùng trực quan, hệ thống quản lý sản phẩm mạnh mẽ, xử lý đơn hàng tự động và các công cụ phân tích kinh doanh chi tiết.

### 👥 Đối Tượng Sử Dụng

- **Khách Hàng**: Duyệt sản phẩm, mua hàng, quản lý đơn hàng cá nhân
- **Quản Trị Viên**: Quản lý sản phẩm, đơn hàng, khách hàng, kho hàng và báo cáo doanh số

## ✨ Tính Năng Chính

### 👨‍💼 Trang Khách Hàng

- 🏠 **Trang Chủ Động** - Hiển thị sản phẩm nổi bật, đề xuất cá nhân hóa
- 🛍️ **Danh Sách Sản Phẩm** - Tìm kiếm, lọc, sắp xếp theo giá, đánh giá
- 📄 **Chi Tiết Sản Phẩm** - Thông tin chi tiết, hình ảnh, đánh giá khách hàng
- 🛒 **Giỏ Hàng** - Quản lý sản phẩm, cập nhật số lượng, tính toán tự động
- 💳 **Thanh Toán** - Giao diện thanh toán an toàn và dễ sử dụng
- 📰 **Blog Tin Tức** - Bài viết về sản phẩm, hướng dẫn, khuyến mãi
- 📧 **Liên Hệ** - Form liên hệ, hỗ trợ khách hàng
- 🔐 **Xác Thực** - Đăng ký, đăng nhập, khôi phục mật khẩu
- 👤 **Quản Lý Tài Khoản** - Xem hồ sơ, lịch sử đơn hàng, địa chỉ giao hàng

### 🎛️ Bảng Điều Khiển Quản Trị

- 📊 **Dashboard Tổng Quan** - Thống kê doanh số, đơn hàng, khách hàng theo thời gian thực
- 📦 **Quản Lý Sản Phẩm** - Thêm/sửa/xóa sản phẩm, quản lý ảnh, SKU
- 🏷️ **Quản Lý Danh Mục** - Tổ chức sản phẩm theo danh mục, thẻ
- 📋 **Quản Lý Đơn Hàng** - Xem danh sách đơn hàng, cập nhật trạng thái, quản lý giao hàng
- 👥 **Quản Lý Khách Hàng** - Danh sách khách hàng, lịch sử mua hàng, phân tích khách hàng
- 📚 **Quản Lý Tin Tức** - Viết, chỉnh sửa, xóa bài viết blog
- ⭐ **Quản Lý Đánh Giá** - Xem xét và phê duyệt đánh giá sản phẩm
- 👨‍💼 **Quản Lý Người Dùng** - Quản lý tài khoản admin, cấp quyền
- 🏢 **Cài Đặt** - Cấu hình cơ bản của cửa hàng
- 📈 **Báo Cáo** - Doanh số bán hàng, sản phẩm bán chạy, xu hướng
- 📦 **Quản Lý Kho** - Theo dõi hàng tồn, cảnh báo hàng sắp hết

## 🛠️ Công Nghệ Sử Dụng

### Frontend (80.2% TypeScript)

| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| **React** | 19.2.7 | Thư viện UI chính |
| **React Router DOM** | 6.30.4 | Định tuyến ứng dụng |
| **TypeScript** | 6.0.2 | Ngôn ngữ lập trình kiểu an toàn |
| **Vite** | 8.1.1 | Build tool và dev server |
| **Tailwind CSS** | 4.3.2 | Styling tiện ích (utility-first) |
| **Framer Motion** | 11.18.2 | Hoạt ảnh và chuyển động |
| **Lucide React** | 1.24.0 | Thư viện biểu tượng SVG |
| **Radix UI** | v1-v2 | Thành phần UI không kèm giao diện |
| **React Hook Form** | 7.81.0 | Quản lý biểu mẫu hiệu quả |
| **Zod** | 3.25.76 | Xác thực schema kiểu an toàn |
| **React Query** | 5.101.2 | Quản lý trạng thái máy chủ |
| **Axios** | 1.18.1 | HTTP client |
| **React Hot Toast** | 2.6.0 | Thông báo toast |
| **Recharts** | 2.15.4 | Thư viện biểu đồ |
| **Zustand** | 4.5.7 | Quản lý trạng thái nhẹ |
| **Swiper** | 11.2.10 | Slider/carousel |
| **HeadlessUI** | 2.2.10 | Thành phần UI không kèm giao diện |

### Backend (17.5% Python)

| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| **FastAPI** | 0.115.5 | Framework REST API hiện đại |
| **Uvicorn** | 0.32.1 | ASGI server |
| **SQLAlchemy** | 2.0.36 | ORM (Object-Relational Mapping) |
| **AsyncPG** | 0.30.0 | Trình điều khiển PostgreSQL async |
| **Alembic** | 1.14.0 | Migration database |
| **Pydantic** | 2.10.3 | Xác thực dữ liệu |
| **Python-Jose** | 3.3.0 | JWT authentication |
| **Passlib + Bcrypt** | 1.7.4 | Mã hóa mật khẩu |
| **Redis** | 5.2.1 | Bộ nhớ cache/session |
| **PostgreSQL** (psycopg2) | 2.9.10 | Database chính |
| **Pillow** | 11.0.0 | Xử lý ảnh |
| **httpx** | 0.27.2 | Async HTTP client |
| **pytest** | 8.3.4 | Testing framework |
| **Slowapi** | 0.1.9 | Rate limiting |

## 📂 Cấu Trúc Dự Án

```
webapp/
├── frontend/                          # Ứng dụng React
│   ├── src/
│   │   ├── pages/                    # Các trang công khai
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── NewsPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   └── auth/
│   │   │       ├── LoginPage.tsx
│   │   │       └── RegisterPage.tsx
│   │   ├── admin/                   # Bảng điều khiển quản trị
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── products/
│   │   │   │   ├── orders/
│   │   │   │   ├── customers/
│   │   │   │   ├── inventory/
│   │   │   │   ├── categories/
│   │   │   │   ├── settings/
│   │   │   │   ├── reports/
│   │   │   │   ├── news/
│   │   │   │   ├── reviews/
│   │   │   │   └── users/
│   │   │   ├── components/
│   │   │   ├── guards/
│   │   │   │   └── AdminGuard.tsx   # Bảo vệ các tuyến admin
│   │   │   └── layout/
│   │   │       └── AdminLayout.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── MainLayout.tsx
│   │   │   └── [các component chung]
│   │   ├── App.tsx                  # Component ứng dụng chính
│   │   └── main.tsx                 # Entry point
│   ├── package.json
│   ├── vite.config.ts              # Cấu hình Vite
│   ├── tsconfig.json               # Cấu hình TypeScript
│   └── .gitignore
│
├── backend/                         # API FastAPI
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/                 # API version 1
│   │   │       ├── routes/         # Endpoint handlers
│   │   │       ├── schemas/        # Pydantic schemas
│   │   │       └── __init__.py
│   │   ├── models/                 # SQLAlchemy models
│   │   ├── services/               # Business logic
│   │   ├── config.py               # Configuration settings
│   │   └── __init__.py
│   ├── main.py                     # FastAPI app entry point
│   ├── requirements.txt            # Python dependencies
│   ├── .gitignore
│   └── pytest.ini
│
└── README.md                        # Tài liệu này
```

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu Hệ Thống

- **Node.js** 18+ và **npm/yarn/pnpm**
- **Python** 3.9+
- **PostgreSQL** 13+
- **Redis** 6+ (tùy chọn, nhưng khuyến khích)
- **Git**

### 1️⃣ Clone Repository

```bash
git clone https://github.com/nhannguyen2005/webapp.git
cd webapp
```

### 2️⃣ Cài Đặt Backend

```bash
cd backend

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Trên Linux/Mac:
source venv/bin/activate
# Trên Windows:
venv\Scripts\activate

# Cài đặt dependencies
pip install -r requirements.txt

# Cấu hình file .env (xem phần Biến Môi Trường)
cp .env.example .env
nano .env  # Chỉnh sửa theo cấu hình của bạn

# Chạy migration database
alembic upgrade head

# Khởi động server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Server sẽ chạy tại**: `http://localhost:8000`
**API Documentation**: `http://localhost:8000/api/v1/openapi.json`

### 3️⃣ Cài Đặt Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install
# hoặc
yarn install
# hoặc
pnpm install

# Khởi động development server
npm run dev
```

**Ứng dụng sẽ mở tại**: `http://localhost:5173`

## 💻 Hướng Dẫn Phát Triển

### Cấu Trúc Dự Án Phát Triển

#### Frontend Development

```bash
cd frontend

# Development server với hot reload
npm run dev

# Build cho production
npm run build

# Preview production build cục bộ
npm run preview
```

**Các lệnh npm khả dụng**:
- `npm run dev` - Khởi động dev server
- `npm run build` - Build cho production
- `npm run preview` - Xem preview build

#### Backend Development

```bash
cd backend

# Chạy development server với auto-reload
uvicorn main:app --reload

# Chạy unit tests
pytest

# Chạy tests với coverage
pytest --cov=app

# Format code
black .

# Kiểm tra linting
flake8 .
```

### Quy Ước Code

#### Frontend (TypeScript/React)

- Sử dụng **functional components** với **hooks**
- Đặt tên file bằng **PascalCase** cho components (e.g., `ProductCard.tsx`)
- Sử dụng **PascalCase** cho exports chính, **camelCase** cho hàm/biến
- Tổ chức components theo tính năng:
  ```
  src/components/
  ├── common/          # Thành phần dùng chung
  ├── layout/          # Layout components
  ├── products/        # Các component liên quan sản phẩm
  └── admin/           # Admin-specific components
  ```

#### Backend (Python/FastAPI)

- Sử dụng **snake_case** cho tên hàm và biến
- Sử dụng **type hints** cho tất cả hàm
- Tổ chức code theo tính năng:
  ```
  app/
  ├── api/v1/
  │   ├── routes/
  │   │   ├── products.py
  │   │   ├── orders.py
  │   │   ├── users.py
  │   │   └── auth.py
  │   └── schemas/
  ├── models/          # Database models
  ├── services/        # Business logic
  └── config.py
  ```

## 🌍 Cấu Hình Biến Môi Trường

### Backend (.env)

```env
# Cấu hình ứng dụng
APP_NAME=ShopDV
APP_VERSION=1.0.0
DEBUG=True

# Database PostgreSQL
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/shopdv_db

# Redis (tùy chọn)
REDIS_URL=redis://localhost:6379/0

# JWT Secret
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Origins
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@shopdv.com

# AWS S3 (nếu sử dụng)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_STORAGE_BUCKET_NAME=shopdv-storage
AWS_S3_REGION_NAME=us-east-1

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=ShopDV
```

## 📚 API Documentation

### Tổng Quan

API được xây dựng với **FastAPI** và tất cả endpoints đều có tài liệu **Swagger** tự động.

### Truy Cập Swagger UI

Khi backend chạy, truy cập:
```
http://localhost:8000/api/v1/openapi.json
```

### Các Endpoint Chính

#### 🔐 Authentication (`/api/v1/auth`)

| Method | Endpoint | Mô Tả |
|--------|----------|--------|
| POST | `/register` | Đăng ký tài khoản mới |
| POST | `/login` | Đăng nhập |
| POST | `/refresh-token` | Làm mới JWT token |
| POST | `/logout` | Đăng xuất |

#### 📦 Products (`/api/v1/products`)

| Method | Endpoint | Mô Tả |
|--------|----------|--------|
| GET | `/` | Danh sách sản phẩm với phân trang |
| GET | `/{id}` | Chi tiết sản phẩm |
| POST | `/` | Tạo sản phẩm (admin) |
| PUT | `/{id}` | Cập nhật sản phẩm (admin) |
| DELETE | `/{id}` | Xóa sản phẩm (admin) |
| GET | `/search` | Tìm kiếm sản phẩm |

#### 📋 Orders (`/api/v1/orders`)

| Method | Endpoint | Mô Tả |
|--------|----------|--------|
| GET | `/` | Danh sách đơn hàng |
| GET | `/{id}` | Chi tiết đơn hàng |
| POST | `/` | Tạo đơn hàng mới |
| PATCH | `/{id}/status` | Cập nhật trạng thái đơn hàng |

#### 👥 Users (`/api/v1/users`)

| Method | Endpoint | Mô Tả |
|--------|----------|--------|
| GET | `/me` | Lấy thông tin người dùng hiện tại |
| PUT | `/me` | Cập nhật thông tin người dùng |
| GET | `/{id}` | Lấy thông tin người dùng (admin) |

### Ví Dụ Request/Response

#### Đăng Nhập

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "full_name": "Nguyễn Văn A",
    "role": "customer"
  }
}
```

## 🧪 Testing

### Frontend Testing

```bash
cd frontend

# Chạy unit tests (nếu có)
npm run test

# Xem coverage
npm run test:coverage
```

### Backend Testing

```bash
cd backend

# Chạy tất cả tests
pytest

# Chạy tests của một module cụ thể
pytest tests/test_products.py

# Chạy tests với verbose output
pytest -v

# Chạy tests với coverage report
pytest --cov=app --cov-report=html
```

## 🐛 Khắc Phục Sự Cố

### Vấn Đề Backend

**Lỗi: `ModuleNotFoundError: No module named 'app'`**

```bash
# Đảm bảo bạn ở trong thư mục backend và đã cài dependencies
pip install -r requirements.txt
```

**Lỗi: Database connection refused**

```bash
# Kiểm tra PostgreSQL đang chạy
# Linux/Mac:
pg_isready

# Kiểm tra DATABASE_URL trong .env
```

**Lỗi: CORS không hoạt động**

```bash
# Cập nhật CORS_ORIGINS trong .env
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

### Vấn Đề Frontend

**Lỗi: `npm ERR! code ERESOLVE`**

```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install

# Hoặc sử dụng legacy peer deps
npm install --legacy-peer-deps
```

**Port 5173 đã được sử dụng**

```bash
# Chỉ định port khác
npm run dev -- --port 3000
```

## 📝 Git Workflow

```bash
# Tạo nhánh feature mới
git checkout -b feature/your-feature-name

# Commit changes
git add .
git commit -m "feat: Mô tả tính năng"

# Push nhánh
git push origin feature/your-feature-name

# Tạo Pull Request trên GitHub
```

### Quy Ước Commit Message

- `feat:` - Tính năng mới
- `fix:` - Sửa lỗi
- `docs:` - Tài liệu
- `style:` - Formatting, không thay đổi logic
- `refactor:` - Tái cấu trúc code
- `test:` - Thêm hoặc cập nhật tests
- `chore:` - Cập nhật dependencies, build scripts

**Ví dụ**:
```
feat: Thêm chức năng tìm kiếm sản phẩm
fix: Sửa lỗi hiển thị giỏ hàng
docs: Cập nhật README.md
```

## 🤝 Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng tuân theo các bước sau:

1. **Fork** repository
2. **Clone** fork của bạn
   ```bash
   git clone https://github.com/your-username/webapp.git
   ```
3. **Tạo nhánh** cho tính năng/fix của bạn
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Commit** các thay đổi
   ```bash
   git commit -m 'feat: Thêm tính năng tuyệt vời'
   ```
5. **Push** đến nhánh
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Tạo Pull Request**

### Hướng Dẫn Đóng Góp

- Tuân theo quy ước code hiện có
- Viết test cho các tính năng mới
- Cập nhật tài liệu nếu cần
- Đảm bảo tất cả tests pass
- Mô tả rõ ràng về thay đổi của bạn trong PR

## 📄 Giấy Phép

Dự án này được cấp phép dưới giấy phép **MIT**. Xem file [LICENSE](LICENSE) để biết chi tiết.

## 📞 Liên Hệ & Hỗ Trợ

- **Email**: support@shopdv.com
- **Issues**: [GitHub Issues](https://github.com/nhannguyen2005/webapp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nhannguyen2005/webapp/discussions)

## 🙏 Cảm Ơn

Cảm ơn tất cả các contributors và những người sử dụng dự án!

---

**Được xây dựng với ❤️ bởi nhannguyen2005**

*Cập nhật lần cuối: Tháng 7, 2026*
