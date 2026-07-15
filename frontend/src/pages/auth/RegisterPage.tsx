import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_BASE}/auth/register`, {
        email,
        username,
        password,
      });

      setSuccess(true);
      // Redirect after 2 seconds to login page
      setTimeout(() => {
        navigate('/login');
      }, 2200);
    } catch (err: any) {
      console.error("Lỗi đăng ký:", err);
      let errMsg = 'Đăng ký thất bại. Vui lòng kiểm tra lại.';
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === 'string') {
          errMsg = detail;
        } else if (Array.isArray(detail)) {
          errMsg = detail.map(errObj => {
            const rawField = String(errObj.loc?.[1] || errObj.loc?.[0] || 'Dữ liệu');
            const fieldMap: Record<string, string> = {
              username: 'Tên đăng nhập',
              email: 'Email',
              password: 'Mật khẩu'
            };
            const field = fieldMap[rawField] || rawField;
            let msg = errObj.msg;
            if (msg.includes('value is not a valid email address')) {
              msg = 'Định dạng email không hợp lệ';
            } else if (msg.includes('at least 8 characters')) {
              msg = 'mật khẩu phải có ít nhất 8 ký tự';
            } else if (msg.includes('at least 3 characters')) {
              msg = 'tên đăng nhập phải có ít nhất 3 ký tự';
            }
            return `${field}: ${msg}`;
          }).join(', ');
        }
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8"
      style={{
        background: '#0C0A09', // Dark theme matching Homepage
        fontFamily: "'Jost', sans-serif"
      }}
    >
      <div
        className="max-w-md w-full p-8 rounded-3xl"
        style={{
          background: '#1C1917',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-extrabold"
            style={{
              background: 'linear-gradient(135deg, #CA8A04, #FBBF24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Tạo tài khoản
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#A8A29E' }}>
            Tham gia cộng đồng mua sắm thông minh tại ShopDV
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div
            className="flex items-center gap-2.5 p-3.5 rounded-xl text-xs font-semibold mb-5 border animate-pulse"
            style={{
              background: 'rgba(239, 68, 68, 0.07)',
              borderColor: 'rgba(239, 68, 68, 0.2)',
              color: '#F87171'
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            className="flex items-center gap-2.5 p-3.5 rounded-xl text-xs font-semibold mb-5 border"
            style={{
              background: 'rgba(34, 197, 94, 0.07)',
              borderColor: 'rgba(34, 197, 94, 0.2)',
              color: '#4ADE80'
            }}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Đăng ký thành công! Đang chuyển hướng về trang đăng nhập...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#E7E5E4' }}>Tên đăng nhập</label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ví dụ: nguyenvana"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: '#292524',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff'
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#CA8A04'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#E7E5E4' }}>Địa chỉ Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nguyenvana@gmail.com"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: '#292524',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff'
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#CA8A04'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#E7E5E4' }}>Mật khẩu</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: '#292524',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#fff'
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#CA8A04'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: '#A8A29E' }}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
            style={{
              background: 'linear-gradient(135deg, #CA8A04, #FBBF24)',
              color: '#1C1917',
              boxShadow: '0 4px 16px rgba(202, 138, 4, 0.2)'
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Đăng ký ngay</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: '#A8A29E' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-semibold transition-colors duration-150" style={{ color: '#CA8A04' }}>
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
