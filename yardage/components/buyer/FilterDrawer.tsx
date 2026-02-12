"use client"

import { useRef, useEffect, useState } from "react"
import { X } from "lucide-react"
import gsap from "gsap"
import { Button } from "../ui/button"
import { Filters } from "@/types/filters"

interface FilterDrawerProps {
    isOpen: boolean
    onClose: () => void
    filters: Filters
    onApplyFilters: (filters: Filters) => void
}

const CATEGORIES = ["All", "Furniture", "Electronics", "Kitchenware", "Books", "Clothing"]
const CONDITIONS = ["All", "new", "like_new", "good", "fair", "poor"]

export default function FilterDrawer({ isOpen, onClose, filters, onApplyFilters }: FilterDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const [localFilters, setLocalFilters] = useState<Filters>(filters)

    useEffect(() => {
        if (isOpen) {
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: "block" })
            gsap.to(drawerRef.current, { x: 0, duration: 0.5, ease: "power3.out" })
        } else {
            gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, display: "none" })
            gsap.to(drawerRef.current, { x: "100%", duration: 0.4, ease: "power3.in" })
        }
    }, [isOpen])

    const handleApply = () => {
        onApplyFilters(localFilters)
        onClose()
    }

    const handleReset = () => {
        const resetFilters: Filters = {
            category: "All",
            condition: "All",
            priceRange: [0, 500000]
        }
        setLocalFilters(resetFilters)
        onApplyFilters(resetFilters)
        onClose()
    }

    return (
        <>
            {/* Overlay */}
            <div 
                ref={overlayRef}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] hidden opacity-0"
                onClick={onClose}
            />

            {/* Drawer */}
            <div 
                ref={drawerRef}
                className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-[101] shadow-2xl flex flex-col translate-x-full"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold">Filters</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Categories */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Category</h3>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setLocalFilters({ ...localFilters, category: cat })}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        localFilters.category === cat 
                                        ? "bg-black text-white" 
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Condition */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Condition</h3>
                        <div className="flex flex-wrap gap-2">
                            {CONDITIONS.map((cond) => (
                                <button
                                    key={cond}
                                    onClick={() => setLocalFilters({ ...localFilters, condition: cond })}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        localFilters.condition === cond 
                                        ? "bg-[#9369FF] text-white" 
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {cond.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Price Range (N)</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-gray-400">Min</label>
                                    <input 
                                        type="number" 
                                        value={localFilters.priceRange[0]}
                                        onChange={(e) => setLocalFilters({ ...localFilters, priceRange: [Number(e.target.value), localFilters.priceRange[1]] })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-400">Max</label>
                                    <input 
                                        type="number" 
                                        value={localFilters.priceRange[1]}
                                        onChange={(e) => setLocalFilters({ ...localFilters, priceRange: [localFilters.priceRange[0], Number(e.target.value)] })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex gap-4">
                    <Button 
                        variant="outline" 
                        onClick={handleReset}
                        className="flex-1 rounded-full h-12"
                    >
                        Reset All
                    </Button>
                    <Button 
                        onClick={handleApply}
                        className="flex-1 bg-black text-white rounded-full h-12 hover:bg-neutral-800"
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>
        </>
    )
}
