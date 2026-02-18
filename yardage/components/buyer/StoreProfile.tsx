"use client"

import React from 'react'
import { trpc } from '@/lib/trpc'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, Star, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from './navbar'
import Footer from '../Footer'

interface StoreProfileProps {
  storeId: string
}

export default function StoreProfile({ storeId }: StoreProfileProps) {
  const { data: store, isLoading: isLoadingStore } = trpc.store.getById.useQuery({ id: storeId })
  const { data: productsData, isLoading: isLoadingProducts } = trpc.product.list.useQuery({ 
    storeId,
    limit: 50 
  })
  const { data: reviewsData, isLoading: isLoadingReviews } = trpc.review.getByStore.useQuery({ 
    storeId,
    limit: 10 
  })

  const isLoading = isLoadingStore || isLoadingProducts || isLoadingReviews

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7FF]">
        <Navbar onFilterClick={() => {}} onSearch={() => {}} />
        <div className="max-w-[1200px] mx-auto px-6 py-12 lg:py-20 space-y-16 flex flex-col items-center">
          {/* Header Skeleton */}
          <div className="flex flex-col items-center gap-6">
            <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
            <div className="space-y-4 flex flex-col items-center">
              <Skeleton className="h-12 w-48 rounded-lg" />
              <Skeleton className="h-6 w-64 rounded-lg" />
            </div>
          </div>

          {/* Reviews Skeleton */}
          <div className="w-full space-y-8 pt-10">
            <Skeleton className="h-8 w-40 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <Skeleton key={i} className="h-40 w-full rounded-[24px]" />
              ))}
            </div>
          </div>

          {/* Products Skeleton */}
          <div className="w-full space-y-8 pt-10">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="aspect-square w-full rounded-[32px]" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-[#FDFBFF] flex flex-col items-center justify-center gap-4">
        <Package size={64} className="text-gray-300" />
        <h1 className="text-2xl font-bold">Store not found</h1>
        <Link href="/dashboard/buyer" className="text-[#8E74FF] hover:underline">Return to home</Link>
      </div>
    )
  }

  const products = productsData?.items || []
  const reviews = reviewsData?.items || []

  return (
    <div className="min-h-screen bg-[#FAF7FF]">
      <Navbar onFilterClick={() => {}} onSearch={() => {}} />
      
      <main className="max-w-[1200px] mx-auto px-6 py-12 lg:py-20">
        {/* Header - Centered */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-white border border-gray-100 mb-6">
            {store.image ? (
              <Image src={store.image} alt={store.name} fill className="object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-[#F0F0F0]">
                <span className="text-3xl font-bold text-gray-400 capitalize">{store.name.charAt(0)}</span>
              </div>
            )}
          </div>
          <h1 className="text-[32px] md:text-[40px] font-bold text-[#140033] mb-2">{store.name}</h1>
          <p className="text-[16px] md:text-[18px] text-[#140033]/40 mb-4">{(store as any).owner?.email || "vendor@yardage.com"}</p>
          
          <div className="flex items-center gap-6 text-[#140033]/60 mb-6">
            <span className="flex items-center gap-1.5 font-medium">
              <Package size={18} />
              {products.length} products
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              {reviewsData?.averageRating.toFixed(1) || "New"}
            </span>
          </div>

          {store.description && (
            <p className="text-[16px] md:text-[18px] text-[#140033]/70 max-w-[700px] leading-relaxed italic">
              "{store.description}"
            </p>
          )}
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mb-20">
            <h2 className="text-[24px] lg:text-[28px] font-bold text-[#140033] mb-8">Top reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review: any) => (
                <div key={review.id} className="bg-[#EDEDED]/50 backdrop-blur-sm p-8 rounded-[24px] flex flex-col justify-between min-h-[160px]">
                  <p className="text-[15px] md:text-[17px] text-[#140033] font-normal leading-relaxed opacity-80 mb-6">
                    "{review.comment}"
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-bold text-[#140033]">{review.user?.name || "Timothy"}</span>
                    <span className="text-[14px] font-medium text-[#9369FF]">{review.rating.toFixed(1)}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid - Collection Style */}
        <div className="space-y-8">
          <h2 className="text-[24px] lg:text-[28px] font-bold text-[#140033]">
            Item sold({products.length})
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group relative aspect-square w-full rounded-[32px] overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
                {product.images?.[0] ? (
                  <Image 
                    src={product.images[0]} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Package size={48} className="text-gray-200" />
                  </div>
                )}
              </Link>
            ))}
          </div>

          {products.length === 0 && (
            <div className="flex flex-col items-center py-20 bg-white/50 rounded-[32px] gap-4">
              <Package size={48} className="text-gray-200" />
              <p className="text-gray-400">This vendor hasn't posted any items yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
