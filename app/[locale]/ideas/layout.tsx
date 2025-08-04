"use client";

import { useState } from "react";
import { withAuth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import MobileDashboardSidebar from "@/components/dashboard/mobile-sidebar";
import "../../../styles/dashboard.css";

function IdeasLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] overflow-x-hidden font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Desktop Sidebar */}
      <DashboardSidebar />
      
      {/* Mobile Sidebar */}
      <MobileDashboardSidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      
      {/* Header */}
      <DashboardHeader onMobileMenuToggle={toggleMobileMenu} />
      
      {/* Main content */}
      <main className="lg:ml-[280px] px-6 py-4 bg-[#0f172a]">
        {children}
      </main>
    </div>
  );
}

export default withAuth(IdeasLayout);