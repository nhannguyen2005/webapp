import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend dùng OAuth2PasswordRequestForm → cần gửi form-data với field "username"
      const formData = new URLSearchParams();
      formData.append('username', email);   // field phải là "username" theo OAuth2 spec
      formData.append('password', password);

      const { data } = await axios.post(`${API_BASE}/auth/login`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      // Lưu token + thông tin user vào store
      setAuth(
        {
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          role: data.user.role.toLowerCase(), // "ADMIN" → "admin"
        },
        data.access_token,
        data.refresh_token,
      );

      // Redirect theo role
      const role = data.user.role?.toLowerCase();
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.detail;
        setError(
          msg === 'Incorrect email or password'
            ? 'Email hoặc mật khẩu không đúng'
            : msg === 'Inactive user'
            ? 'Tài khoản đã bị vô hiệu hóa'
            : 'Đăng nhập thất bại, vui lòng thử lại',
        );
      } else {
        setError('Không thể kết nối đến server');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ background: '#0C0A09' }}
    >
      {/* Card */}
      <div
        className="w-full max-w-md rounded-3xl p-8 sm:p-10"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              fontFamily: "'Bodoni Moda', serif",
              background: 'linear-gradient(135deg,#CA8A04,#FBBF24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ShopDV
          </h1>
          <h2
            className="text-xl font-semibold mb-1"
            style={{ fontFamily: "'Jost', sans-serif", color: '#F5F5F0' }}
          >
            Đăng nhập
          </h2>
          <p className="text-sm" style={{ color: '#78716C', fontFamily: "'Jost', sans-serif" }}>
            Chào mừng bạn quay trở lại
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-6 text-sm"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#FCA5A5',
              fontFamily: "'Jost', sans-serif",
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#A8A29E', fontFamily: "'Jost', sans-serif" }}
            >
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@shopdv.vn"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#F5F5F0',
                fontFamily: "'Jost', sans-serif",
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'rgba(202,138,4,0.6)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(202,138,4,0.1)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#A8A29E', fontFamily: "'Jost', sans-serif" }}
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#F5F5F0',
                  fontFamily: "'Jost', sans-serif",
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(202,138,4,0.6)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(202,138,4,0.1)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: '#57534E' }}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label
              className="flex items-center gap-2 text-sm cursor-pointer select-none"
              style={{ color: '#78716C', fontFamily: "'Jost', sans-serif" }}
            >
              <input type="checkbox" className="rounded" />
              Ghi nhớ đăng nhập
            </label>
            <a
              href="#"
              className="text-sm transition-colors duration-200 hover:text-amber-400"
              style={{ color: '#CA8A04', fontFamily: "'Jost', sans-serif" }}
            >
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: loading
                ? 'rgba(202,138,4,0.5)'
                : 'linear-gradient(135deg,#CA8A04,#FBBF24)',
              color: '#0C0A09',
              fontFamily: "'Jost', sans-serif",
              boxShadow: loading ? 'none' : '0 8px 24px rgba(202,138,4,0.3)',
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang đăng nhập...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Đăng nhập
              </>
            )}
          </button>
        </form>

        {/* Register link */}
        <p
          className="mt-6 text-center text-sm"
          style={{ color: '#57534E', fontFamily: "'Jost', sans-serif" }}
        >
          Chưa có tài khoản?{' '}
          <Link
            to="/register"
            className="font-semibold transition-colors duration-200 hover:text-amber-300"
            style={{ color: '#CA8A04' }}
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
