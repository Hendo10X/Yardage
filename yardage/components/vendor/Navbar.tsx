"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Logo from "@/images/Logo.svg"
import { Button } from '../ui/button'
import { Menu, Search } from 'lucide-react'

import RoleSwitcher from './Roleswitcher'
import MobileMenu from './Mobilemenu'
import UserDropdown from '../UserDropdown'


import { usePathname } from 'next/navigation'

interface NavbarProps {
  onFilterClick?: () => void
  onSearch?: (query: string) => void
}

export default function Navbar({ onFilterClick, onSearch }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { name: 'My stash', href: '/dashboard/vendor' },
    { name: 'Inbox', href: '/dashboard/vendor/inbox' },
    { name: 'Post', href: '/dashboard/vendor/posts' },
    { name: 'Profile', href: '/dashboard/vendor/profile' },
  ]

  return (
    <nav className='px-6 lg:px-20 lg:py-10 relative'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center '>
                <Image src={Logo} alt='Logo' className='w-[100px] h-[100px] lg:hidden flex' />
                <ul className='hidden lg:flex items-center gap-6'>
                    {navLinks.map((link) => (
                        <Link 
                            key={link.href}
                            href={link.href} 
                            className={`px-6 py-2 rounded-full text-[16px] transition-all ${
                                pathname === link.href 
                                    ? 'bg-[#F0F0F0] font-medium' 
                                    : 'font-normal hover:bg-gray-50'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </ul>
            </div>

            <div className='hidden lg:flex items-center gap-8'>
                <RoleSwitcher />
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
