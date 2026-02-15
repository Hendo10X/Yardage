"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { Skeleton } from '../ui/skeleton'
import { Package, HeartOff } from 'lucide-react'

export default function Wishlist() {
  const { data: items, isLoading } = trpc.wishlist.list.useQuery()

  return (
    <div className="px-6 lg:px-20 py-6 lg:py-10">
        <div>
            <h1 className="lg:text-[57px] text-[40px] font-bold mb-12">Wishlist</h1>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12'>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='flex flex-col gap-4'>
                <Skeleton className="w-full aspect-square rounded-[20px]" />
                <div className="flex flex-col gap-2">
                   <Skeleton className="h-6 w-3/4 rounded-md" />
                   <Skeleton className="h-5 w-1/2 rounded-md" />
                   <Skeleton className="h-5 w-1/4 rounded-md" />
                </div>
              </div>
            ))
          ) : !items || items.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
              <HeartOff size={64} className="text-gray-200" />
              <div className="text-center">
                <h2 className="text-2xl font-medium text-gray-500">Your wishlist is empty</h2>
                <Link href="/dashboard/buyer" className="text-[#9369FF] hover:underline mt-2 inline-block">
                  Go explore products
                </Link>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <Link href={`/product/${item.id}`} key={item.id} className='flex flex-col gap-4 group cursor-pointer product-card'>
                <div className="relative overflow-hidden rounded-[13px]">
                  <Image 
                      src={item.images?.[0] || "/placeholder-product.png"} 
                      alt={item.name} 
                      width={400}
                      height={400}
                      className='w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110' 
                  />
                  {item.condition === 'new' && (
                      <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[14px] font-medium text-black">
                          New
                      </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className='text-[18px] font-medium text-black'>{item.name}</h2>
                  <p className='text-[16px] text-gray-500'>By {item.store?.name || "Unknown Vendor"}</p>
                  <p className='text-[16px] font-bold mt-1'>N{item.price.toLocaleString()}</p>
                </div>
              </Link>
          )))}
        </div>
    </div>
  )
}
