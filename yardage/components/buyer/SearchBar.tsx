"use client"

import { useState, useRef } from "react"
import { Search, X } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

interface SearchBarProps {
    onSearch?: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [query, setQuery] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        if (isExpanded) {
            gsap.to(containerRef.current, {
                width: "300px",
                duration: 0.4,
                ease: "power3.out"
            })
            gsap.fromTo(inputRef.current, 
                { opacity: 0, x: 10 },
                { opacity: 1, x: 0, duration: 0.3, delay: 0.1 }
            )
            inputRef.current?.focus()
        } else {
            gsap.to(containerRef.current, {
                width: "40px",
                duration: 0.3,
                ease: "power3.in"
            })
            gsap.to(inputRef.current, { opacity: 0, x: 10, duration: 0.2 })
        }
    }, [isExpanded])

    return (
        <div 
            ref={containerRef}
            className="flex items-center bg-[#F5F5F5] rounded-full overflow-hidden h-10 px-2.5 transition-colors"
            style={{ width: "40px" }}
        >
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-center shrink-0"
            >
                <Search size={20} className="text-gray-600" />
            </button>
            
            <input 
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                    const newQuery = e.target.value
                    setQuery(newQuery)
                    onSearch?.(newQuery)
                }}
                placeholder="Search products..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-full opacity-0"
                onBlur={() => {
                    if (query === "") setIsExpanded(false)
                }}
            />

            {isExpanded && query && (
                <button 
                    onClick={() => {
                        setQuery("")
                        onSearch?.("")
                    }}
                    className="shrink-0 ml-1 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <X size={14} className="text-gray-400" />
                </button>
            )}
        </div>
    )
}
