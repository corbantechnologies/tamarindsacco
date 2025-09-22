"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X as XIcon } from "lucide-react";

function MemberNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <header
        className="bg-[#045e32] text-white sticky top-0 z-50"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <h1 className="ml-2 text-xl md:text-2xl font-bold">
              Tamarind SACCO
            </h1>
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/" className="hover:underline text-base">
              Home
            </Link>
            <Link
              href="/member/dashboard"
              className="hover:underline text-base"
            >
              Dashboard
            </Link>
            {/* <Link href="/member/savings" className="hover:underline text-base">
              Savings
            </Link>
            <Link href="/member/loans" className="hover:underline text-base">
              Loans
            </Link>
            <Link href="/member/profile" className="hover:underline text-base">
              Profile
            </Link> */}
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="border-white text-white hover:bg-white hover:text-[#045e32] text-base py-1"
            >
              Logout
            </Button>
          </nav>
          <Button
            variant="outline"
            className="md:hidden border-white text-white hover:bg-white hover:text-[#045e32]"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
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
        } transition-transform duration-300 ease-in-out md:hidden border-l border-[#045e32] shadow-lg`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#045e32]">Menu</h2>
            <Button
              variant="ghost"
              className="p-2 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <XIcon className="h-5 w-5 text-black" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-6 p-4">
            <Link
              href="/"
              className="text-lg hover:text-[#067a46]"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/member/dashboard"
              className="text-lg hover:text-[#067a46]"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            {/* <Link
              href="/member/savings"
              className="text-lg hover:text-[#067a46]"
              onClick={() => setIsMenuOpen(false)}
            >
              Savings
            </Link>
            <Link
              href="/member/loans"
              className="text-lg hover:text-[#067a46]"
              onClick={() => setIsMenuOpen(false)}
            >
              Loans
            </Link>
            <Link
              href="/member/profile"
              className="text-lg hover:text-[#067a46]"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link> */}
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

export default MemberNavbar;
