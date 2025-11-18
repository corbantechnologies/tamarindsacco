// components/layout/SaccoAdminNavbar.jsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu as MenuIcon,
  X as XIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

function SaccoAdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPersonalOpen, setIsPersonalOpen] = useState(false);

  const togglePersonal = () => setIsPersonalOpen(!isPersonalOpen);

  return (
    <>
      {/* Navbar */}
      <header className="bg-[#cc5500] text-white sticky top-0 z-50 shadow-lg">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold tracking-wide">
            Tamarind SACCO Admin
          </h1>
          <Button
            variant="ghost"
            className="hover:bg-white/20"
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[280px] bg-white text-black shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#cc5500]">Admin Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
            >
              <XIcon className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <Link
              href="/sacco-admin/dashboard"
              className="block py-3 px-4 text-lg font-medium hover:bg-[#cc5500]/10 hover:text-[#cc5500] rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>

            {/* PERSONAL DROPDOWN */}
            <div className="space-y-1">
              <button
                onClick={togglePersonal}
                className="w-full flex items-center justify-between py-3 px-4 text-lg font-medium hover:bg-[#cc5500]/10 hover:text-[#cc5500] rounded-lg transition"
              >
                <span>Personal</span>
                {isPersonalOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>

              {isPersonalOpen && (
                <div className="pl-8 space-y-2 bg-gray-50 rounded-lg py-2">
                  <Link
                    href="/sacco-admin/personal"
                    className="block py-2 px-4 text-base hover:text-[#cc5500] hover:bg-white rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Personal
                  </Link>
                  <Link
                    href="/sacco-admin/personal/loan-applications"
                    className="block py-2 px-4 text-base hover:text-[#cc5500] hover:bg-white rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Loan Applications
                  </Link>
                  <Link
                    href="/sacco-admin/personal/guarantor-profile"
                    className="block py-2 px-4 text-base hover:text-[#cc5500] hover:bg-white rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Guarantor Profile
                  </Link>
                </div>
              )}
            </div>

            {/* Admin Links */}
            <Link
              href="/sacco-admin/members"
              className="block py-3 px-4 text-lg font-medium hover:bg-[#cc5500]/10 hover:text-[#cc5500] rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Members
            </Link>

            <Link
              href="/sacco-admin/transact"
              className="block py-3 px-4 text-lg font-medium hover:bg-[#cc5500]/10 hover:text-[#cc5500] rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Transact
            </Link>

            <Link
              href="/sacco-admin/loan-applications"
              className="block py-3 px-4 text-lg font-medium hover:bg-[#cc5500]/10 hover:text-[#cc5500] rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              All Loan Applications
            </Link>

            <Link
              href="/sacco-admin/withdrawals"
              className="block py-3 px-4 text-lg font-medium hover:bg-[#cc5500]/10 hover:text-[#cc5500] rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Withdrawals
            </Link>

            <Link
              href="/sacco-admin/settings"
              className="block py-3 px-4 text-lg font-medium hover:bg-[#cc5500]/10 hover:text-[#cc5500] rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile & Settings
            </Link>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full border-[#cc5500] text-[#cc5500] hover:bg-[#cc5500] hover:text-white font-semibold"
              onClick={() => {
                setIsMenuOpen(false);
                signOut({ callbackUrl: "/login" });
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}

export default SaccoAdminNavbar;
