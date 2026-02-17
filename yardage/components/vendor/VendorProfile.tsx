'use client'

import React from 'react'
import Image from 'next/image'
import { trpc } from '@/lib/trpc'
import { Skeleton } from '../ui/skeleton'
import { Package } from 'lucide-react'
import CreateStore from './CreateStore'

export default function VendorProfile() {
  const { data: status, isLoading } = trpc.vendor.checkStatus.useQuery()
  const { data: stats } = trpc.vendor.stats.useQuery(undefined, {
    enabled: !!status?.isVendor
  })
  const { data: products } = trpc.product.listMine.useQuery({ limit: 6 }, {
    enabled: !!status?.isVendor
  })

  // Mock reviews for UI consistency as shown in image
  const reviews = [
    {
      id: 1,
      text: "“Got 8 packs of pegs for a small amount, the delivery was fast and smooth”",
      author: "Timothy",
      rating: "4.5/5"
    },
    {
      id: 2,
      text: "“Got 8 packs of pegs for a small amount, the delivery was fast and smooth”",
      author: "Ana",
      rating: "4.4/5"
    }
  ]

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col items-center">
        {/* Profile Header Skeleton */}
        <div className="flex flex-col items-center gap-6 mb-20 text-center">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="space-y-2 flex flex-col items-center">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <Skeleton className="h-6 w-32 rounded-lg" />
          </div>
        </div>

        {/* Reviews Skeleton */}
        <div className="w-full mb-20">
          <Skeleton className="h-8 w-40 rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[180px] w-full rounded-[24px]" />
            <Skeleton className="h-[180px] w-full rounded-[24px]" />
          </div>
        </div>

        {/* Products Skeleton */}
        <div className="w-full">
          <Skeleton className="h-8 w-48 rounded-lg mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <Skeleton className="aspect-square rounded-[32px]" />
            <Skeleton className="aspect-square rounded-[32px]" />
            <Skeleton className="aspect-square rounded-[32px]" />
          </div>
        </div>
      </div>
    )
  }

  if (!status?.isVendor) {
    return <CreateStore />
  }

  const store = status.store

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col items-center">
      {/* Profile Header - Centered as per image */}
      <div className="flex flex-col items-center gap-6 mb-20 text-center">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-[#F9F8FF] border-4 border-white shadow-sm relative">
           {store?.image ? (
             <Image src={store.image} alt={store.name} fill className="object-cover" />
           ) : (
             <div className="w-full h-full bg-linear-to-br from-[#8E74FF] to-[#7C5CFF] flex items-center justify-center text-white text-4xl font-bold">
               {store?.name[0].toUpperCase()}
             </div>
           )}
        </div>
        
        <div>
          <h1 className="text-[25px] md:text-[40px] font-bold text-[#140033] mb-1">{store?.name}</h1>
          <p className="text-[15px] md:text-[18px] text-[#140033]/40 font-medium">{status?.email}</p>
        </div>
      </div>

      {/* Top Reviews Section */}
      <div className="w-full mb-20">
        <h2 className="text-[20px] lg:text-[28px] font-bold text-[#140033] mb-8">Top reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-[#EDEDED] p-8 rounded-[24px] flex flex-col justify-between min-h-[180px]">
              <p className="text-[15px] md:text-[18px] text-[#140033] font-normal leading-relaxed opacity-80">
                {review.text}
              </p>
              <div className="flex justify-between items-center mt-6">
                <span className="text-[16px] font-bold text-[#140033]">{review.author}</span>
                <span className="text-[16px] font-medium text-[#8E74FF] opacity-60 font-mono">{review.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item Sold Section */}
      <div className="w-full">
        <h2 className="text-[20px] lg:text-[28px] font-bold text-[#140033] mb-8 text-left w-full">
          Item sold({products?.total || 0})
        </h2>
        
        {products?.items.length === 0 ? (
          <div className="bg-white rounded-[32px] p-20 text-center border border-dashed border-[#E5E0FF]">
            <Package className="mx-auto text-[#E5E0FF] mb-4" size={64} />
            <p className="text-[20px] text-[#140033]/40 font-medium">No items sold yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {products?.items.map((product) => (
              <div key={product.id} className="aspect-square rounded-[32px] overflow-hidden bg-[#EDEDED] shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group">
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={40} className="text-[#140033]/20" />
                  </div>
                )}
                {/* Visual indicator for price/name on hover if needed, but image shows clean grid */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
