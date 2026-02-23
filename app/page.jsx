"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Wallet,
  ShieldCheck,
  TrendingUp,
  Menu as MenuIcon,
  X as XIcon,
  ChevronRight,
  Landmark,
  PiggyBank,
  CheckCircle2,
  Hotel
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#045e32] selection:text-white flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md text-gray-900 sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all">
        <div className="container mx-auto px-4 md:px-8 py-3 lg:py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 sm:h-12 sm:w-12 bg-[#045e32] rounded-xl flex items-center justify-center shadow-inner shrink-0">
               <Landmark className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
             </div>
            <div className="flex flex-col">
               <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight leading-none">TAMARIND</h1>
               <span className="text-[9px] sm:text-[10px] font-bold text-[#e66b00] uppercase tracking-widest leading-none mt-1">SACCO SOCIETY LTD</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center lg:gap-8 md:gap-4">
            <Link href="#solutions" className="text-sm font-semibold text-gray-600 hover:text-[#045e32] transition-colors">
              Solutions
            </Link>
            <Link href="#about" className="text-sm font-semibold text-gray-600 hover:text-[#045e32] transition-colors">
              About Us
            </Link>
            <Link href="/login" className="text-sm font-bold text-[#045e32] hover:text-[#e66b00] transition-colors">
              Member Portal
            </Link>
          </nav>
          <Button
            variant="ghost"
            className="md:hidden text-gray-600 hover:bg-gray-100 p-2"
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-[60] w-[280px] bg-white text-gray-900 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden shadow-2xl flex flex-col`}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900">Menu</h2>
          <Button
            variant="ghost"
            className="p-2 -mr-2 hover:bg-gray-100 rounded-full"
            onClick={() => setIsMenuOpen(false)}
          >
            <XIcon className="h-5 w-5 text-gray-600" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="#solutions"
            className="px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#045e32] rounded-xl transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Solutions
          </Link>
          <Link
            href="#about"
            className="px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#045e32] rounded-xl transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
          <div className="h-px bg-gray-100 my-2 mx-4" />
          <Link
            href="/login"
            className="px-4 py-3 text-base font-bold text-[#045e32] hover:bg-green-50 rounded-xl transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Member Portal
          </Link>
        </nav>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 md:hidden transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#045e32] py-20 lg:py-32">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
           <div className="w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
           <div className="w-[400px] h-[400px] rounded-full bg-[#e66b00]/20 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
           <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="max-w-2xl">
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e66b00] opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e66b00]"></span>
                    </span>
                    Exclusive to Tamarind Employees
                 </div>
                 <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                   Secure your future with the <span className="text-[#e66b00]">Tamarind Financial Family.</span>
                 </h2>
                 <p className="text-lg md:text-xl text-green-50 mb-8 max-w-xl font-medium leading-relaxed opacity-90">
                   Empowering the hospitality champions of Kenya. Access tailored savings, competitive loans, and exceptional dividends designed specifically for Tamarind Management Limited workers.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center gap-4">
                   <Button
                     asChild
                     size="lg"
                     variant="outline"
                     className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white font-bold rounded-full px-8 h-14 text-base backdrop-blur-sm transition-all"
                   >
                     <Link href="/login">Access Portal <ChevronRight className="ml-2 h-4 w-4" /></Link>
                   </Button>
                 </div>
              </div>
              
              <div className="hidden lg:block relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#e66b00]/20 to-transparent rounded-3xl transform rotate-3 scale-105" />
                 <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
                    <div className="space-y-6">
                       <div className="bg-white rounded-2xl p-6 shadow-lg">
                          <div className="flex justify-between items-center mb-4">
                             <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                   <TrendingUp className="h-5 w-5 text-[#045e32]" />
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Annual Dividend</p>
                                   <p className="text-lg font-black text-gray-900">12.5% Rate</p>
                                </div>
                             </div>
                             <span className="text-emerald-500 text-sm font-bold bg-emerald-50 px-2 py-1 rounded-md">+2.1%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                             <div className="h-full bg-[#045e32] w-3/4 rounded-full" />
                          </div>
                       </div>

                       <div className="bg-white rounded-2xl p-6 shadow-lg">
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                   <Wallet className="h-5 w-5 text-[#e66b00]" />
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Loans</p>
                                   <p className="text-lg font-black text-gray-900">Within 48 Hrs</p>
                                </div>
                             </div>
                             <Button size="sm" variant="ghost" className="text-[#045e32] font-bold p-0 hover:bg-transparent">
                                Apply <ChevronRight className="h-4 w-4 ml-1" />
                             </Button>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Stats/Trust Bar */}
      <div className="bg-white border-b border-gray-100 py-8 relative md:-mt-6 z-20 shadow-sm md:mx-4 lg:mx-auto max-w-7xl md:rounded-2xl">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 text-center md:divide-x divide-gray-100">
               <div className="px-4">
                  <p className="text-3xl font-black text-[#045e32] mb-1">2,500+</p>
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Active Members</p>
               </div>
               <div className="px-4">
                  <p className="text-3xl font-black text-[#045e32] mb-1">KES 1.2B</p>
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Assets Managed</p>
               </div>
               <div className="px-4">
                  <p className="text-3xl font-black text-[#045e32] mb-1">12.5%</p>
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Avg. Dividends</p>
               </div>
               <div className="px-4">
                  <p className="text-3xl font-black text-[#045e32] mb-1">48 Hrs</p>
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Loan Processing</p>
               </div>
            </div>
         </div>
      </div>

      {/* Features Section */}
      <section id="solutions" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
             <h2 className="text-[#e66b00] font-bold tracking-widest uppercase text-sm mb-3">Tailored Solutions</h2>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">
              Financial products built for the hospitality industry.
            </h3>
            <p className="text-gray-600 font-medium text-base md:text-lg">
              We understand the unique financial needs of Tamarind employees. Our cooperative provides accessible, high-value financial tools to secure your future.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <Card className="border-none shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="pt-8 px-6 md:px-8 pb-4">
                 <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center mb-6">
                    <PiggyBank className="h-7 w-7 text-[#045e32]" />
                 </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  High-Yield Savings
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 md:px-8 pb-8">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Build your safety net with our diverse savings products. Earn competitive interest rates that outperform traditional banks.
                </p>
                <ul className="space-y-3">
                   <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#e66b00] shrink-0" />
                      <span className="text-sm font-medium text-gray-700">Check-off system integration</span>
                   </li>
                   <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#e66b00] shrink-0" />
                      <span className="text-sm font-medium text-gray-700">Attractive annual dividends</span>
                   </li>
                   <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#e66b00] shrink-0" />
                      <span className="text-sm font-medium text-gray-700">Flexible voluntary contributions</span>
                   </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300 rounded-3xl overflow-hidden bg-[#045e32] text-white">
              <CardHeader className="pt-8 px-6 md:px-8 pb-4">
                 <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <Wallet className="h-7 w-7 text-white" />
                 </div>
                <CardTitle className="text-xl font-bold text-white">
                  Accessible Credit
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 md:px-8 pb-8">
                <p className="text-green-50/90 mb-6 leading-relaxed">
                  Access funds quickly when you need them most. Our loan products are designed with low interest rates and flexible repayment terms.
                </p>
                <ul className="space-y-3">
                   <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#e66b00] shrink-0" />
                      <span className="text-sm font-medium text-green-50">Development & emergency loans</span>
                   </li>
                   <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#e66b00] shrink-0" />
                      <span className="text-sm font-medium text-green-50">Up to 3x your share capital</span>
                   </li>
                   <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#e66b00] shrink-0" />
                      <span className="text-sm font-medium text-green-50">Streamlined guarantor process</span>
                   </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="pt-8 px-6 md:px-8 pb-4">
                 <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6">
                    <ShieldCheck className="h-7 w-7 text-[#e66b00]" />
                 </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Welfare & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 md:px-8 pb-8">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We stand by our members during critical times. Benefit from risk-mitigation funds and welfare support for your peace of mind.
                </p>
                <ul className="space-y-3">
                   <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#045e32] shrink-0" />
                      <span className="text-sm font-medium text-gray-700">Dedicated welfare fund</span>
                   </li>
                   <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#045e32] shrink-0" />
                      <span className="text-sm font-medium text-gray-700">Insurance on deposits</span>
                   </li>
                   <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#045e32] shrink-0" />
                      <span className="text-sm font-medium text-gray-700">Retirement planning support</span>
                   </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 rounded-l-[100px] hidden lg:block -z-10" />
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
             <div className="order-2 lg:order-1 w-full lg:w-1/2 relative">
                <div className="aspect-square max-w-md mx-auto relative z-10 w-full">
                   <div className="w-full h-full bg-gray-200 rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center p-8 text-center bg-gradient-to-br from-gray-100 to-gray-200">
                         {/* Fallback abstract icon showing community in hospitality */}
                         <div className="flex flex-col items-center">
                            <Hotel className="h-16 w-16 text-[#045e32] mb-3 opacity-30" />
                            <Users className="h-24 w-24 text-[#045e32] mb-4 opacity-70" />
                            <p className="text-lg font-bold text-gray-500 uppercase tracking-widest hidden sm:block">Tamarind Community</p>
                         </div>
                         <div className="absolute inset-0 bg-[#045e32]/5 mix-blend-multiply" />
                   </div>
                   {/* Decorative floating card */}
                   <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center gap-3 sm:gap-4">
                         <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#e66b00]/10 flex items-center justify-center shrink-0">
                            <span className="font-black text-[#e66b00] text-lg sm:text-xl">15+</span>
                         </div>
                         <div>
                            <p className="font-bold text-gray-900 text-sm sm:text-base">Years of Service</p>
                            <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Trusted by employees</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="order-1 lg:order-2 w-full lg:w-1/2">
                <h2 className="text-[#e66b00] font-bold tracking-widest uppercase text-sm mb-3">About Tamarind Sacco</h2>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
                  Growing together, <br/>securing our future.
                </h3>
                <div className="w-20 h-2 bg-[#045e32] rounded-full mb-8" />
                <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                  Established to serve the workforce of <strong>Tamarind Management Limited</strong>, our SACCO is an exclusive financial cooperative dedicated to the prosperity of our members.
                </p>
                <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
                  We leverage our collective strength to provide premier financial services that are often out of reach at traditional banking institutions. By bringing Tamarind employees together, we create a powerhouse of financial stability, investment growth, and mutual support.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                   <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-gray-50 text-center sm:text-left">
                      <div className="h-10 w-10 shrink-0 bg-[#045e32]/10 rounded-lg flex items-center justify-center">
                         <span className="font-black text-[#045e32]">01</span>
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900 mb-1">Our Mission</h4>
                         <p className="text-sm text-gray-600">To mobilize savings and provide affordable credit to enhance members' socio-economic well-being.</p>
                      </div>
                   </div>
                   <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-gray-50 text-center sm:text-left">
                      <div className="h-10 w-10 shrink-0 bg-[#e66b00]/10 rounded-lg flex items-center justify-center">
                         <span className="font-black text-[#e66b00]">02</span>
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900 mb-1">Our Vision</h4>
                         <p className="text-sm text-gray-600">To be the preferred financial partner for all Tamarind Management employees.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#e66b00]" />
        {/* Subtle pattern or gradient */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px sm:24px sm:24px' }} />
        <div className="absolute top-0 right-0 w-full sm:w-1/2 h-full bg-gradient-to-b sm:bg-gradient-to-l from-black/30 sm:from-black/20 to-transparent" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight max-w-3xl mx-auto leading-tight">
            Take the first step towards financial freedom today.
          </h2>
          <p className="text-base md:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto font-medium">
            Join thousands of your colleagues at Tamarind Management who are already building their wealth with us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Button asChild size="lg" className="bg-white text-[#e66b00] hover:bg-gray-100 font-bold rounded-full px-8 h-12 sm:h-14 text-base sm:text-lg shadow-xl shrink-0">
               <Link href="/login">Login to Portal</Link>
             </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#0f172a] text-gray-300 py-12 md:py-16 border-t-[8px] border-[#045e32]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
             <div className="md:col-span-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                  <div className="h-10 w-10 bg-[#045e32] rounded-xl flex items-center justify-center shadow-inner">
                    <Landmark className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col text-left">
                     <h3 className="text-xl font-black text-white tracking-tight leading-none">TAMARIND</h3>
                     <span className="text-[10px] font-bold text-[#e66b00] uppercase tracking-widest leading-none mt-1">SACCO SOCIETY LTD</span>
                  </div>
                </div>
                <p className="text-gray-400 max-w-sm mx-auto md:mx-0 mb-6 leading-relaxed">
                  The exclusive financial cooperative for employees of Tamarind Management Limited. Committed to prosperity, transparency, and community growth.
                </p>
                <div className="flex justify-center md:justify-start gap-4">
                   <div className="h-10 w-10 rounded-full bg-white/5 hover:bg-[#e66b00] transition-colors flex items-center justify-center cursor-pointer">
                      <span className="text-sm font-bold text-white">In</span>
                   </div>
                   <div className="h-10 w-10 rounded-full bg-white/5 hover:bg-[#e66b00] transition-colors flex items-center justify-center cursor-pointer">
                      <span className="text-sm font-bold text-white">X</span>
                   </div>
                   <div className="h-10 w-10 rounded-full bg-white/5 hover:bg-[#e66b00] transition-colors flex items-center justify-center cursor-pointer">
                      <span className="text-sm font-bold text-white">Fb</span>
                   </div>
                </div>
             </div>
             
             <div className="text-center md:text-left">
                <h4 className="text-white font-bold mb-4 md:mb-6 tracking-wider uppercase text-sm">Quick Links</h4>
                <ul className="space-y-3 md:space-y-4">
                   <li><Link href="#solutions" className="hover:text-white transition-colors">Our Solutions</Link></li>
                   <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
                   <li><Link href="/login" className="hover:text-white transition-colors">Member Portal</Link></li>
                </ul>
             </div>

             <div className="text-center md:text-left">
                <h4 className="text-white font-bold mb-4 md:mb-6 tracking-wider uppercase text-sm">Contact Us</h4>
                <ul className="space-y-3 md:space-y-4">
                   <li className="text-sm">Tamarind Management Office,<br/>Nairobi, Kenya</li>
                   <li><a href="mailto:info@tamarindsacco.co.ke" className="hover:text-white transition-colors">info@tamarindsacco.co.ke</a></li>
                   <li className="font-mono text-white/80">+254 (0) 700 000 000</li>
                </ul>
             </div>
          </div>
          
          <div className="border-t border-white/10 pt-6 md:pt-8 flex flex-col items-center gap-2 text-xs md:text-sm text-gray-500 text-center">
             <p>&copy; {new Date().getFullYear()} Tamarind Sacco Society Ltd. All rights reserved.</p>
             <p>
                Powered by <span className="font-bold text-gray-400">Corban Technologies LTD</span>
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
