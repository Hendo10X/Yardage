"use client"

import { useState, useRef } from "react"
import { Button } from "../ui/button"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ChevronDown, X } from "lucide-react"

interface RoleSwitcherProps {
    alignment?: 'start' | 'center' | 'end'
}

export default function RoleSwitcher({ alignment = 'center' }: RoleSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)


    useGSAP(() => {
        if (isOpen) {
            gsap.to(dropdownRef.current, {
                height: "auto",
                opacity: 1,
                duration: 0.4,
                ease: "power3.out",
                display: "block"
            })
            
            gsap.fromTo(contentRef.current?.children || [], 
                { y: -10, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.3, 
                    stagger: 0.1, 
                    delay: 0.1,
                    ease: "back.out(1.7)"
                }
            )
        } else {
            gsap.to(dropdownRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power3.in",
                display: "none"
            })
        }
    }, { scope: containerRef, dependencies: [isOpen] })

    return (
        <div ref={containerRef} className="relative z-50">
            <Button 
                onClick={() => setIsOpen(!isOpen)}
                className='bg-[#FFA500] text-black hover:text-white hover:bg-black w-[100px] h-[36px] rounded-full font-medium text-[16px] flex items-center justify-center gap-1 z-50 relative'
            >
                Vendor
            </Button>

            <div 
                ref={dropdownRef}
                className={`absolute top-15 w-[219px] h-[148px] bg-[#EBEBEB] rounded-[24px] overflow-hidden hidden pt-[15px] ${
                    alignment === 'center' ? 'left-1/2 -translate-x-1/2' :
                    alignment === 'end' ? 'right-0' :
                    'left-0'
                }`}
                style={{ opacity: 0 }}
            >
                <div ref={contentRef} className="flex flex-col items-center gap-3 p-4 pb-6">
                    <div className="bg-[#E0E0E0] text-black px-4 py-2 rounded-full text-sm font-medium w-full text-center">
                        Switch to buyer
                    </div>
                    <Link href="/dashboard/buyer" className="w-full">
                        <Button className="bg-[#0A0A0A] text-white hover:bg-gray-800 w-full rounded-full h-[40px] font-medium">
                            Switch
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

