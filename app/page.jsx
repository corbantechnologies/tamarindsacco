"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Wallet,
  Lock,
  Menu as MenuIcon,
  X as XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="sticky bg-white top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
                              src="/mzeduLogo-noBg.png"
                              alt="Mzedu SACCO Logo"
                              width={100}
                              height={100}
                              className=""
                            />
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="hover:underline">
              Features
            </Link>
            <Link href="#about" className="hover:underline">
              About
            </Link>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Join Now
            </Link>
          </nav>
          <Button
            variant="outline"
            className="md:hidden border-white text-white hover:bg-white hover:text-primary"
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
        } transition-transform duration-300 ease-in-out md:hidden border-l border-primary shadow-lg`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-primary">Menu</h2>
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
              href="#features"
              className="text-lg hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-lg hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/login"
              className="text-lg hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-lg hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Join Now
            </Link>
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

      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          {/* <Image
            src="/logo.png"
            alt="Mzedu SACCO Logo"
            width={120}
            height={120}
            className="mx-auto mb-6 rounded-full"
          /> */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Mzedu SACCO
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Empowering communities through secure savings and cooperative
            growth. Join us to manage your finances with ease and trust.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              asChild
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              asChild
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            Why Choose Mzedu SACCO?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-primary shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Wallet className="h-6 w-6" />
                  Flexible Savings Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Choose from a variety of savings types tailored to your
                  financial goals, with competitive interest rates.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Users className="h-6 w-6" />
                  Community-Driven
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Join a cooperative that prioritizes member welfare and
                  collective growth for all.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Lock className="h-6 w-6" />
                  Secure Platform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your data and transactions are protected with top-tier
                  security measures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-[#f5f5f5]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            About Mzedu SACCO
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Mzedu SACCO is dedicated to fostering financial inclusion and
            empowerment. Our platform allows members to save, access loans, and
            manage their finances with ease, all while being part of a
            supportive community. Built with trust and transparency, we aim to
            help you achieve your financial dreams.
          </p>
          <Button
            asChild
            className="bg-primary hover:bg-[#e66b00] text-white"
          >
            <Link href="/register">Join Our Community</Link>
          </Button>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Sign up today and start your journey with Mzedu SACCO. Experience
            the benefits of cooperative savings and financial growth.
          </p>
          <Button asChild className="bg-white text-primary hover:bg-gray-100">
            <Link href="/register">Sign Up Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
          {/* <Image
                              src="/mzeduLogo-noBg.png"
                              alt="Mzedu SACCO Logo"
                              width={100}
                              height={100}
                              className=""
                            /> */}
            <h3 className="text-lg font-semibold">Mzedu SACCO</h3>
          </div>
          <p className="mb-4">
            Powered by{" "}
            <span className="font-semibold">Corban Technologies LTD</span>
          </p>
          <div className="flex justify-center gap-6">
            <Link href="#features" className="hover:underline">
              Features
            </Link>
            <Link href="#about" className="hover:underline">
              About
            </Link>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Join Now
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
