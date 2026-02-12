"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Logo from "@/images/Logo.svg"
import { Button } from '../ui/button'
import { Menu, Search } from 'lucide-react'

import RoleSwitcher from './RoleSwitcher'
import MobileMenu from './MobileMenu'
import UserDropdown from '../UserDropdown'
import SearchBar from './SearchBar'

interface NavbarProps {
  onFilterClick?: () => void
  onSearch?: (query: string) => void
}

export default function Navbar({ onFilterClick, onSearch }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className='px-6 lg:px-20 py-6 lg:py-10 relative'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-20'>
                <Image src={Logo} alt="YardageLogo" width={100} height={100} className="w-[80px] h-auto lg:w-[100px]" />
                <ul className='hidden lg:flex items-center gap-6'>
                    <Link href="/dashboard" className='bg-[#F0F0F0] px-6 py-2 rounded-full text-[16px] font-medium' >Explore</Link>
                    <Link href="" className='text-[16px] font-normal' >Categories</Link>
                    <Link href="" className='text-[16px] font-normal' >Wishlist</Link>
                </ul>
            </div>

            <div className='hidden lg:flex items-center gap-8'>
                <RoleSwitcher />

                <button onClick={onFilterClick} className='font-normal text-[16px] hover:text-[#9369FF] transition-colors'>Filter</button>
                <SearchBar onSearch={onSearch} />
                <UserDropdown />
            </div> 

            <div className="lg:hidden">
                <Button variant="ghost" onClick={() => setIsMobileMenuOpen(true)} className="">
                    <Menu size={100} className='text-black' />
                </Button>
            </div>
        </div>
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </nav>
  )
}
