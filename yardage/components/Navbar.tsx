"use client"

import React, { useState } from 'react'
import Logo from "@/images/Logo.svg"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from './ui/button'

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="relative w-full">
      <div className="flex justify-between items-center gap-4 px-6 lg:px-28 py-6 lg:py-10">
        <Link href="/" className="z-50">
          <Image src={Logo} alt="Logo" width={120} height={40} className="w-auto h-8 md:h-10" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8 items-center">
          <Link href="/about" className="text-medium text-[18px] hover:text-primary transition-colors">About us</Link>
          <Link href="/faq" className="text-medium text-[18px] hover:text-primary transition-colors">FAQ</Link>
          <Link href="/how-it-works" className="text-medium text-[18px] hover:text-primary transition-colors">How it works</Link>
        </ul>

        {/* Desktop Auth Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/login" className="text-medium text-[18px] hover:text-primary transition-colors">Login</Link>
          <Button className='cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-full text-[18px] font-medium'>
            <Link href="/signup" onClick={toggleMenu} className="">
              Sign up
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden z-50 p-2 text-foreground" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 bg-background/95 backdrop-blur-md z-40 transition-all duration-300 md:hidden
        ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
      `}>
        <div className="flex flex-col items-center bg-[#ede7e7] justify-center h-full gap-8 p-6 text-center">
          <Link href="/" onClick={toggleMenu} className="text-[18px] font-medium">About us</Link>
          <Link href="/faq" onClick={toggleMenu} className="text-[18px] font-medium">FAQ</Link>
          <Link href="/how-it-works" onClick={toggleMenu} className="text-[18px] font-medium">How it works</Link>
          <div className="flex flex-col gap-4 w-full mt-4">
            <Link href="/login" onClick={toggleMenu} className="text-[18px] font-medium">Login</Link>
            <Button className='cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-full text-[18px] font-medium'>
              <Link href="/signup" onClick={toggleMenu} className="">
                Sign up
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
