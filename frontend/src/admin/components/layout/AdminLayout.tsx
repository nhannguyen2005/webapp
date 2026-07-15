import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const BG = '#0A0A0F';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: BG, fontFamily: "'Jost', 'Fira Sans', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminHeader />

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: BG }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
