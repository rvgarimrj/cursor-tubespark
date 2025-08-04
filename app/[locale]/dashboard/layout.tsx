"use client";

import { withAuth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import "../../../styles/dashboard.css";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] overflow-x-hidden font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Header */}
      <DashboardHeader />
      
      {/* Main content */}
      <main className="bg-[#0f172a]">
        {children}
      </main>
    </div>
  );
}

export default withAuth(DashboardLayout);