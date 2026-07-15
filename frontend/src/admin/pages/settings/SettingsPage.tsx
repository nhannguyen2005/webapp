import React, { useState } from 'react';
import { Settings, Globe, Mail, CreditCard, Shield, Save } from 'lucide-react';

const SURFACE  = '#111118';
const SURFACE2 = '#1A1A25';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'smtp' | 'payment' | 'security'>('general');
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [siteName, setSiteName] = useState('ShopDV');
  const [siteTitle, setSiteTitle] = useState('Tài Khoản Bản Quyền Giá Sinh Viên');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [smtpServer, setSmtpServer] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(465);
  const [smtpUser, setSmtpUser] = useState('notification@shopdv.vn');

  const [momoActive, setMomoActive] = useState(true);
  const [vnpayActive, setVnpayActive] = useState(true);
  const [bankActive, setBankActive] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert("Đã lưu các thiết lập cấu hình hệ thống thành công!");
    }, 800);
  };

  const tabs = [
    { id: 'general', label: 'Cấu hình chung', icon: <Globe className="w-4 h-4" /> },
    { id: 'smtp', label: 'SMTP Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'payment', label: 'Cổng thanh toán', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'security', label: 'Bảo mật', icon: <Shield className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5" style={{ color: '#6366F1' }} />
        <div>
          <h1 className="text-xl font-bold font-display" style={{ color: TEXT, fontFamily: "'Bodoni Moda', serif" }}>
            Cài đặt hệ thống
          </h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            Cấu hình cổng thanh toán, thông tin website và bảo mật
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Side: Tabs Navigation */}
        <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-3 md:pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-200"
              style={{
                background: activeTab === tab.id ? 'rgba(99,102,241,0.12)' : 'transparent',
                border: `1px solid ${activeTab === tab.id ? 'rgba(99,102,241,0.25)' : 'transparent'}`,
                color: activeTab === tab.id ? '#818CF8' : MUTED,
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Side: Tab Contents Panel */}
        <div className="md:col-span-3">
          <form
            onSubmit={handleSave}
            className="rounded-2xl p-6 space-y-6"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm border-b pb-2" style={{ color: TEXT, borderColor: BORDER }}>Thiết lập chung</h3>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>Tên website</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={e => setSiteName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>Tiêu đề trang (SEO Title)</label>
                  <input
                    type="text"
                    value={siteTitle}
                    onChange={e => setSiteTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
                  />
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs cursor-pointer select-none" style={{ color: TEXT }}>
                    <input
                      type="checkbox"
                      checked={maintenanceMode}
                      onChange={e => setMaintenanceMode(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    Kích hoạt Chế độ Bảo trì (Maintenance Mode)
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'smtp' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm border-b pb-2" style={{ color: TEXT, borderColor: BORDER }}>Cấu hình Máy chủ Gửi thư (SMTP)</h3>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>SMTP Host</label>
                  <input
                    type="text"
                    value={smtpServer}
                    onChange={e => setSmtpServer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>SMTP Port</label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={e => setSmtpPort(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>Tài khoản SMTP</label>
                  <input
                    type="email"
                    value={smtpUser}
                    onChange={e => setSmtpUser(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm border-b pb-2" style={{ color: TEXT, borderColor: BORDER }}>Phương thức thanh toán tích hợp</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-xl cursor-pointer select-none" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                    <span className="text-xs font-semibold" style={{ color: TEXT }}>Thanh toán qua ví MoMo</span>
                    <input
                      type="checkbox"
                      checked={momoActive}
                      onChange={e => setMomoActive(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl cursor-pointer select-none" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                    <span className="text-xs font-semibold" style={{ color: TEXT }}>Thanh toán qua cổng VNPay</span>
                    <input
                      type="checkbox"
                      checked={vnpayActive}
                      onChange={e => setVnpayActive(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl cursor-pointer select-none" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                    <span className="text-xs font-semibold" style={{ color: TEXT }}>Chuyển khoản ngân hàng trực tiếp</span>
                    <input
                      type="checkbox"
                      checked={bankActive}
                      onChange={e => setBankActive(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm border-b pb-2" style={{ color: TEXT, borderColor: BORDER }}>Thông số Bảo mật & Session</h3>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>Thời hạn hết hạn JWT Token (Phút)</label>
                  <input
                    type="number"
                    defaultValue={15}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>Giới hạn số lần đăng nhập sai (Khóa IP)</label>
                  <input
                    type="number"
                    defaultValue={5}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-semibold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff' }}
            >
              {submitting ? (
                <>
                  <Loader className="w-3.5 h-3.5 animate-spin" /> Đang lưu cấu hình...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Lưu thiết lập
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Loader({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
