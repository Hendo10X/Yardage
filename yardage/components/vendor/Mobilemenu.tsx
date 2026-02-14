"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { X, Search } from "lucide-react"
import { Button } from "../ui/button"
import gsap from "gsap"
import RoleSwitcher from "./Roleswitcher"
import { authClient } from "@/lib/auth-client"
import Image from "next/image"

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const { data: session } = authClient.useSession()
    const menuRef = useRef<HTMLDivElement>(null)
    const linksRef = useRef<HTMLUListElement>(null)
    const actionsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) {
            gsap.to(menuRef.current, {
                x: 0,
                duration: 0.5,
                ease: "power3.out",
                display: "flex"
            })
            
            gsap.fromTo(linksRef.current?.children || [], 
                { x: 50, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 0.4, 
                    stagger: 0.1, 
                    delay: 0.2,
                    ease: "power2.out"
                }
            )

            gsap.fromTo(actionsRef.current?.children || [], 
                { y: 20, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.4, 
                    stagger: 0.1, 
                    delay: 0.4,
                    ease: "power2.out"
                }
            )
        } else {
            gsap.to(menuRef.current, {
                x: "100%",
                duration: 0.4,
                ease: "power3.in",
                display: "none" 
            })
        }
    }, [isOpen])

    return (
        <div 
            ref={menuRef} 
            className="fixed inset-0 bg-[#F9F3FD] z-60 flex flex-col p-6 translate-x-full"
            style={{ display: 'none' }}
        >
            <div className="flex justify-end mb-8">
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                    <X className="h-20 w-20 text-black" />
                </Button>
            </div>

            <div className="flex flex-col h-full justify-between">
                <ul ref={linksRef} className="flex flex-col gap-6">
                    <Link href="" className="text-4xl font-light text-black hover:text-[#9369FF] transition-colors" onClick={onClose}>
                        My stash
                    </Link>
                    <Link href="" className="text-4xl font-light text-black hover:text-[#9369FF] transition-colors" onClick={onClose}>
                        Inbox
                    </Link>
                    <Link href="" className="text-4xl font-light text-black hover:text-[#9369FF] transition-colors" onClick={onClose}>
                        Posts
                    </Link>
                    <Link href="" className="text-4xl font-light text-black hover:text-[#9369FF] transition-colors" onClick={onClose}>
                        Profile
                    </Link>
                </ul>

                <div ref={actionsRef} className="flex flex-col gap-6 pb-10">
                    {/* <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                        <Search className="h-6 w-6 text-gray-500" />
                        <input type="text" placeholder="Search..." className="bg-transparent text-xl outline-none w-full placeholder:text-gray-400" />
                    </div> */}
                    
                    <div className="flex items-center justify-between relative z-50">
                        <span className="text-xl font-medium">Buying as</span>
                       <div className="scale-100 origin-right">
                           <RoleSwitcher alignment="end" />
                       </div>
                    </div>

                    {session ? (
                        <div className="flex flex-col gap-4 border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between text-xl font-medium">
                                <span>{session.user.name}</span>
                                <div className='h-[40px] w-[40px] rounded-full text-black bg-[#EFEFEF] flex items-center justify-center text-sm overflow-hidden'>
                                    {session.user.image ? (
                                        <Image src={session.user.image} alt={session.user.name} width={40} height={40} className="h-full w-full object-cover" />
                                    ) : (
                                        session.user.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={async () => {
                                    await authClient.signOut({
                                        fetchOptions: {
                                            onSuccess: () => {
                                                onClose()
                                                window.location.href = "/"
                                            }
                                        }
                                    })
                                }}
                                className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-medium text-center"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 border-t border-gray-200 pt-4">
                            <Link href="/login" onClick={onClose} className="w-full py-3 text-center text-xl font-medium">
                                Login
                            </Link>
                            <Link href="/signup" onClick={onClose} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium text-center">
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
