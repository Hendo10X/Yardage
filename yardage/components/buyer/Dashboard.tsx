"use client"

import { useBuyer } from '@/context/BuyerContext'
import Product from './Product'

export default function Dashboard() {
  const { searchQuery, filters } = useBuyer()

  return (
    <Product filters={filters} searchQuery={searchQuery} />
  )
}
