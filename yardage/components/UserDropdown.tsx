"use client"

import { useState, useRef, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import Image from "next/image"
import gsap from "gsap"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UserDropdown() {
    const { data: session, isPending } = authClient.useSession()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (isOpen) {
            gsap.fromTo(menuRef.current, 
                { opacity: 0, y: -10, scale: 0.95 }, 
                { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" }
            )
        } else {
            gsap.to(menuRef.current, { opacity: 0, y: -10, scale: 0.95, duration: 0.15, ease: "power2.in" })
        }
    }, [isOpen])

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")
                }
            }
        })
    }

    if (isPending) return <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full" />

    if (!session) {
        return (
            <div className="flex items-center gap-4">
                <a href="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</a>
                <a href="/signup" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                    Sign up
                </a>
            </div>
        )
    }

    const user = session.user
    const initials = user.name ? user.name.charAt(0).toUpperCase() : "U"

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none overflow-hidden border border-gray-200"
            >
                {user.image ? (
                    <Image src={user.image} alt={user.name} width={40} height={40} className="h-full w-full object-cover" />
                ) : (
                    <span className="text-sm font-semibold text-gray-700">{initials}</span>
                )}
            </button>

            {isOpen && (
                <div 
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-[13px] shadow-sm border border-gray-100 py-2 z-50 origin-top-right"
                >
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Logged in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate uppercase">{user.name}</p>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            )}
            
            {/* Click outside to close */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}
