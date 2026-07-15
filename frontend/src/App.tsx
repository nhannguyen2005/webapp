import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

// Public layout
import MainLayout from './components/layout/MainLayout';

// Public pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';

// Admin layout & guard
import AdminGuard from './admin/guards/AdminGuard';
import AdminLayout from './admin/components/layout/AdminLayout';

// Admin pages
import DashboardPage from './admin/pages/DashboardPage';
import ProductsListPage from './admin/pages/products/ProductsListPage';
import ProductFormPage from './admin/pages/products/ProductFormPage';
import OrdersListPage from './admin/pages/orders/OrdersListPage';
import OrderDetailPage from './admin/pages/orders/OrderDetailPage';
import CustomersListPage from './admin/pages/customers/CustomersListPage';
import InventoryPage from './admin/pages/inventory/InventoryPage';
import CategoriesPage from './admin/pages/categories/CategoriesPage';
import SettingsPage from './admin/pages/settings/SettingsPage';
import ReportsPage from './admin/pages/reports/ReportsPage';
import AdminNewsPage from './admin/pages/news/NewsPage';
import ReviewsPage from './admin/pages/reviews/ReviewsPage';
import UsersPage from './admin/pages/users/UsersPage';



import UserPortalPage from './pages/UserPortalPage';

/* ── Animated public routes ──────────────────────────────────── */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ── PUBLIC routes (with main layout) ── */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="dashboard" element={<UserPortalPage />} />
        </Route>

        {/* ── ADMIN routes (with admin layout, role-guarded) ── */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsListPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="orders" element={<OrdersListPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="customers" element={<CustomersListPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="news" element={<AdminNewsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
