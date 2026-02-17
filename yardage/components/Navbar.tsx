"use client"

import React, { useState } from 'react'
import Logo from "@/images/Logo.svg"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import MobileNav from './MobileNav'
import { Button } from './ui/button'

export default function Navbar() {
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

      <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </nav>
  )
}
