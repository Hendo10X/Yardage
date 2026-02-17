"use client"

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Skeleton } from '../ui/skeleton'
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { trpc } from '@/lib/trpc'
import { ProductCondition } from '@/server/enums'

interface ProductProps {
  filters?: {
    category: string;
    condition: string;
    priceRange: [number, number];
  },
  searchQuery?: string
}

export default function Product({ filters, searchQuery }: ProductProps) {
     const containerRef = useRef<HTMLDivElement>(null)
    
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = trpc.product.list.useInfiniteQuery({
    limit: 12,
    search: searchQuery,
    categoryId: filters?.category !== 'All' ? filters?.category : undefined,
    condition: (filters?.condition !== 'All' ? filters?.condition : undefined) as ProductCondition,
    minPrice: filters?.priceRange[0],
    maxPrice: filters?.priceRange[1],
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialCursor: 0,
  })

  const products = data?.pages.flatMap(page => page.items) || []
  return (
      <div className='' ref={containerRef}>
          <div className='px-6 lg:px-20 py-6 lg:py-10'>
            <div>
              <h1 className='lg:text-[50px] text-[40px] font-medium mb-12'>Yard</h1>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12'>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className='flex flex-col gap-4'>
                      <Skeleton className="w-full aspect-square rounded-[20px]" />
                      <div className="flex flex-col gap-2">
                         <Skeleton className="h-6 w-3/4 rounded-md" />
                         <Skeleton className="h-5 w-1/2 rounded-md" />
                         <Skeleton className="h-5 w-1/4 rounded-md" />
                      </div>
                    </div>
                  ))
                ) : (
                  products.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id} className='flex flex-col gap-4 group cursor-pointer product-card'>
                    <div className="relative overflow-hidden rounded-[13px] ">
                      <Image 
                          src={product.images?.[0] || "/placeholder-product.png"} 
                          alt={product.name} 
                          width={400}
                          height={400}
                          className='w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110' 
                      />
                      {product.condition === 'new' && (
                          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[14px] font-medium text-black">
                              New
                          </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className='text-[18px] font-medium text-black'>{product.name}</h2>
                      <p className='text-[16px] text-gray-500'>Posted by {product.store?.name || "Unknown Vendor"}</p>
                      <p className='text-[16px] font-bold mt-1'>N{product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                )))}
              </div>
              
              {hasNextPage && (
                  <div className="flex justify-center mt-12 pb-8">
                      <Button 
                          onClick={() => fetchNextPage()} 
                          disabled={isFetchingNextPage || isLoading}
                          className="bg-black text-white rounded-full px-8 py-6 text-[16px] font-medium hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95"
                      >
                          {isFetchingNextPage ? (
                              <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Loading...
                              </>
                          ) : (
                              "Load More"
                          )}
                      </Button>
                  </div>
              )}
              
            </div>
          </div>
      </div>
    )
}
