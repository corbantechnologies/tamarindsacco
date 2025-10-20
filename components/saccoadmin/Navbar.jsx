"use client";

import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X as XIcon } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import React, { useState } from "react";

function SaccoAdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <header className="bg-[#cc5500] text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">Tamarind SACCO</h1>
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              href="/sacco-admin/dashboard"
              className="hover:underline text-base"
            >
              Dashboard
            </Link>
            <Link
              href="/sacco-admin/personal"
              className="hover:underline text-base"
            >
              Personal
            </Link>
            <Link
              href="/sacco-admin/members"
              className="hover:underline text-base"
            >
              Members
            </Link>
            <Link
              href="/sacco-admin/withdrawals"
              className="hover:underline text-base"
            >
              Withdrawals
            </Link>
            <Link
              href="/sacco-admin/settings"
              className="hover:underline text-base"
            >
              Profile
            </Link>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="border-white text-black hover:bg-white hover:text-[#cc5500] text-base py-1"
            >
              Logout
            </Button>
          </nav>
          <Button
            variant="outline"
            className="md:hidden border-white cursor-pointer text-black hover:bg-white hover:text-[#cc5500]"
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[200px] sm:w-[300px] bg-white text-black transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden border-l border-[#cc5500] shadow-lg`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#cc5500]">Menu</h2>
            <Button
              variant="ghost"
              className="p-2 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <XIcon className="h-5 w-5 text-black" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-6 p-4">
            <Link
              href="/sacco-admin/dashboard"
              className="text-lg hover:text-[#cc5500]"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/sacco-admin/personal"
              className="text-lg hover:text-[#cc5500]"
              onClick={() => setIsMenuOpen(false)}
            >
              Personal
            </Link>
            <Link
              href="/sacco-admin/members"
              className="text-lg hover:text-[#cc5500]"
              onClick={() => setIsMenuOpen(false)}
            >
              Members
            </Link>
            <Link
              href="/sacco-admin/withdrawals"
              className="text-lg hover:text-[#cc5500]"
              onClick={() => setIsMenuOpen(false)}
            >
              Withdrawals
            </Link>
            <Link
              href="/sacco-admin/settings"
              className="text-lg hover:text-[#cc5500]"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setIsMenuOpen(false);
                signOut({ callbackUrl: "/login" });
              }}
              className="border-[#045e32] text-[#045e32] hover:bg-[#045e32] hover:text-white text-base py-2"
            >
              Logout
            </Button>
          </nav>
        </div>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

export default SaccoAdminNavbar;
