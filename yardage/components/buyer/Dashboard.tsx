"use client"

import { useState } from 'react'
import Navbar from './navbar'
import { Footer } from '../Footer'
import Product from './Product'
import FilterDrawer from '@/components/buyer/FilterDrawer'
import { Filters } from '@/types/filters'

export default function Dashboard() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Filters>({
    category: 'All',
    condition: 'All',
    priceRange: [0, 500000]
  })

  return (
    <div className='min-h-screen relative overflow-x-hidden'>
        <Navbar onFilterClick={() => setIsFilterOpen(true)} onSearch={setSearchQuery} />
        <Product filters={filters} searchQuery={searchQuery} />
        <Footer />
        
        <FilterDrawer 
          isOpen={isFilterOpen} 
          onClose={() => setIsFilterOpen(false)} 
          filters={filters}
          onApplyFilters={setFilters}
        />
    </div>
  )
}
