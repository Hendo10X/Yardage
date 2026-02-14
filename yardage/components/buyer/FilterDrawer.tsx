"use client"

import { useRef, useState } from "react"
import { X } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Button } from "../ui/button"
import { Filters } from "@/types/filters"
import { trpc } from "@/lib/trpc"
import { ProductCondition } from "@/server/enums"

interface FilterDrawerProps {
    isOpen: boolean
    onClose: () => void
    filters: Filters
    onApplyFilters: (filters: Filters) => void
}

export default function FilterDrawer({ isOpen, onClose, filters, onApplyFilters }: FilterDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const [localFilters, setLocalFilters] = useState<Filters>(filters)

    const { data: categoriesData } = trpc.category.list.useQuery()

    // Consolidate categories and conditions
    const categories = ["All", ...(categoriesData?.map(c => c.name) || [])]
    const conditions: string[] = ["All", ...Object.values(ProductCondition)]

    const categoryNameToId = (name: string) => {
        if (name === "All") return "All"
        return categoriesData?.find(c => c.name === name)?.id || "All"
    }

    useGSAP(() => {
        if (isOpen) {
            // Force display block before animating opacity
            gsap.set(overlayRef.current, { display: "block" })
            gsap.to(overlayRef.current, { 
                opacity: 1, 
                duration: 0.3 
            })
            
            gsap.to(drawerRef.current, { 
                x: 0, 
                duration: 0.5, 
                ease: "power3.out" 
            })
        } else {
            gsap.to(overlayRef.current, { 
                opacity: 0, 
                duration: 0.3,
                onComplete: () => {
                    gsap.set(overlayRef.current, { display: "none" })
                }
            })
            
            gsap.to(drawerRef.current, { 
                x: "100%", 
                duration: 0.4, 
                ease: "power3.in" 
            })
        }
    }, { dependencies: [isOpen] })

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
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                style={{ display: "none", opacity: 0 }}
                onClick={onClose}
            />

            {/* Drawer */}
            <div 
                ref={drawerRef}
                className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-[101] shadow-2xl flex flex-col"
                style={{ transform: "translateX(100%)" }}
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
                            {categories.map((catName) => (
                                <button
                                    key={catName}
                                    onClick={() => setLocalFilters({ ...localFilters, category: categoryNameToId(catName) })}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        (localFilters.category === categoryNameToId(catName)) 
                                        ? "bg-black text-white" 
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {catName}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Condition */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Condition</h3>
                        <div className="flex flex-wrap gap-2">
                            {conditions.map((cond) => (
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
