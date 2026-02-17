"use client"

import { useRef } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "./ui/button"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

interface MobileNavProps {
    isOpen: boolean
    onClose: () => void
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
    const menuRef = useRef<HTMLDivElement>(null)
    const linksRef = useRef<HTMLUListElement>(null)
    const actionsRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
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
                    <X size={28} className=" text-black" />
                </Button>
            </div>

            <div className="flex flex-col h-full justify-between">
                <ul ref={linksRef} className="flex flex-col gap-8">
                    <Link href="/about" className="text-4xl font-light text-black hover:text-[#9369FF] transition-colors" onClick={onClose}>
                        About us
                    </Link>
                    <Link href="/faq" className="text-4xl font-light text-black hover:text-[#9369FF] transition-colors" onClick={onClose}>
                        FAQ
                    </Link>
                    <Link href="/how-it-works" className="text-4xl font-light text-black hover:text-[#9369FF] transition-colors" onClick={onClose}>
                        How it works
                    </Link>
                </ul>

                <div ref={actionsRef} className="flex flex-col gap-6 pb-20">
                    <div className="flex flex-col gap-4 border-t border-gray-200 pt-8">
                        <Link href="/login" onClick={onClose} className="w-full py-4 text-center text-xl font-medium">
                            Login
                        </Link>
                        <Link 
                            href="/signup" 
                            onClick={onClose} 
                            className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium text-center text-xl"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
