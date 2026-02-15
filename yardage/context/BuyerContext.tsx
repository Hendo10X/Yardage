"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Filters } from '@/types/filters'

interface BuyerContextType {
    isFilterOpen: boolean
    setIsFilterOpen: (isOpen: boolean) => void
    searchQuery: string
    setSearchQuery: (query: string) => void
    filters: Filters
    setFilters: (filters: Filters) => void
}

const BuyerContext = createContext<BuyerContextType | undefined>(undefined)

export function BuyerProvider({ children }: { children: ReactNode }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filters, setFilters] = useState<Filters>({
        category: 'All',
        condition: 'All',
        priceRange: [0, 500000]
    })

    return (
        <BuyerContext.Provider value={{
            isFilterOpen,
            setIsFilterOpen,
            searchQuery,
            setSearchQuery,
            filters,
            setFilters
        }}>
            {children}
        </BuyerContext.Provider>
    )
}

export function useBuyer() {
    const context = useContext(BuyerContext)
    if (context === undefined) {
        throw new Error('useBuyer must be used within a BuyerProvider')
    }
    return context
}
