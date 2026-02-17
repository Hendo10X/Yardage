"use client"

import { BuyerProvider, useBuyer } from "@/context/BuyerContext"
import Navbar from "@/components/buyer/navbar"
import FilterDrawer from "@/components/buyer/FilterDrawer"
import Footer from "@/components/Footer"

function BuyerLayoutContent({ children }: { children: React.ReactNode }) {
    const { isFilterOpen, setIsFilterOpen, filters, setFilters, setSearchQuery } = useBuyer()

    return (
        <div className='min-h-screen relative overflow-x-hidden'>
            <Navbar 
                onFilterClick={() => setIsFilterOpen(true)} 
                onSearch={setSearchQuery} 
            />
            {children}
            {/* <Footer /> */}
            
            <FilterDrawer 
                isOpen={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)} 
                filters={filters}
                onApplyFilters={setFilters}
            />
        </div>
    )
}

export default function BuyerDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <BuyerProvider>
            <BuyerLayoutContent>
                {children}
            </BuyerLayoutContent>
        </BuyerProvider>
    )
}
