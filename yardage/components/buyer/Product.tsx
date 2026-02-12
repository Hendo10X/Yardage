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
import Product1 from "@/images/product1.png"
import Product2 from "@/images/product2.png"
import Product3 from "@/images/product3.png"
import Product4 from "@/images/product4.png"
import Product5 from "@/images/product5.png"
import Product6 from "@/images/product6.png"
import Product7 from "@/images/product7.png"
import Product8 from "@/images/product8.png"
import Product9 from "@/images/product9.png"
import Product10 from "@/images/product10.png"
import Product11 from "@/images/product11.png"
import Product12 from "@/images/product12.png"

const Products = [
    {
        id: 1,
        name: "Clip-On Bedside Shelf",
        PostedBy: "Ada",
        price: "N30,000",
        priceValue: 30000,
        image: Product1,
        isNew: true,
        category: "Furniture",
        condition: "good"
    },
    {
        id: 2,
        name: "Adjustable Laptop Stand",
        PostedBy: "Taye",
        price: "N130,000",
        priceValue: 130000,
        image: Product2,
        isNew: false,
        category: "Electronics",
        condition: "like_new"
    },
    {
        id: 3,
        name: "Hydration Flask",
        PostedBy: "Uma",
        price: "N5,000",
        priceValue: 5000,
        image: Product3,
        isNew: true,
        category: "Kitchenware",
        condition: "new"
    },
    {
        id: 4,
        name: "Electric Kettle",
        PostedBy: "Kevin",
        price: "N15,000",
        priceValue: 15000,
        image: Product4,
        isNew: false,
        category: "Kitchenware",
        condition: "good"
    },
    {
        id: 5,
        name: "Product 5",
        PostedBy: "Adaeze",
        price: "N10,000",
        priceValue: 10000,
        image: Product5,
        category: "Books",
        condition: "fair"
    },
    {
        id: 6,
        name: "Product 6",
        PostedBy: "Hendo",
        price: "N10,000",
        priceValue: 10000,
        image: Product6,
        category: "Furniture",
        condition: "poor"
    },
    {
        id: 7,
        name: "Product 7",
        PostedBy: "Jeff",
        price: "N20,000",
        priceValue: 20000,
        image: Product7,
        category: "Clothing",
        condition: "new"
    },
    {
        id: 8,
        name: "Product 8",
        PostedBy: "James",
        price: "N24,000",
        priceValue: 24000,
        image: Product8,
        category: "Electronics",
        condition: "good"
    },
    {
        id: 9,
        name: "Product 9",
        PostedBy: "Oma",
        price: "N20,000",
        priceValue: 20000,
        image: Product9,
        category: "Furniture",
        condition: "like_new"
    },
    {
        id: 10,
        name: "Product 10",
        PostedBy: "Big Oma",
        price: "N27,000",
        priceValue: 27000,
        image: Product10,
        category: "Electronics",
        condition: "good"
    },
    {
        id: 11,
        name: "Product 11",
        PostedBy: "Blessing",
        price: "N60,000",
        priceValue: 60000,
        image: Product11,
        category: "Kitchenware",
        condition: "fair"
    },
    {
        id: 12,
        name: "Product 12",
        PostedBy: "Williams",
        price: "N45,000",
        priceValue: 45000,
        image: Product12,
        category: "Clothing",
        condition: "like_new"
    },
]

const AllProducts = [
    ...Products,
    ...Products.map(p => ({ ...p, id: p.id + 12 })),
    ...Products.map(p => ({ ...p, id: p.id + 24 })),
]

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
      } = useInfiniteQuery({
        queryKey: ['products', filters, searchQuery],
        queryFn: async ({ pageParam = 0 }) => {
          await new Promise(resolve => setTimeout(resolve, 1000))
          const itemsPerPage = 12
          const start = pageParam as number
          
          let filtered = AllProducts;
          
          if (filters) {
              filtered = filtered.filter(p => {
                  const matchCategory = filters.category === 'All' || p.category === filters.category;
                  const matchCondition = filters.condition === 'All' || p.condition === filters.condition;
                  const matchPrice = p.priceValue >= filters.priceRange[0] && p.priceValue <= filters.priceRange[1];
                  return matchCategory && matchCondition && matchPrice;
              });
          }

          if (searchQuery) {
              const lowerQuery = searchQuery.toLowerCase();
              filtered = filtered.filter(p => 
                  p.name.toLowerCase().includes(lowerQuery) || 
                  p.PostedBy.toLowerCase().includes(lowerQuery)
              );
          }
          
          return filtered.slice(start, start + itemsPerPage)
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
          const nextIndex = allPages.reduce((acc, page) => acc + page.length, 0)
          
          let filtered = AllProducts;
          
          if (filters) {
              filtered = filtered.filter(p => {
                  const matchCategory = filters.category === 'All' || p.category === filters.category;
                  const matchCondition = filters.condition === 'All' || p.condition === filters.condition;
                  const matchPrice = p.priceValue >= filters.priceRange[0] && p.priceValue <= filters.priceRange[1];
                  return matchCategory && matchCondition && matchPrice;
              });
          }

          if (searchQuery) {
              const lowerQuery = searchQuery.toLowerCase();
              filtered = filtered.filter(p => 
                  p.name.toLowerCase().includes(lowerQuery) || 
                  p.PostedBy.toLowerCase().includes(lowerQuery)
              );
          }

          const totalCount = filtered.length;

          return nextIndex < totalCount ? nextIndex : undefined
        }
      })
    
      const products = data?.pages.flat() || []

      useGSAP(() => {
        if (!isLoading) {
          gsap.from(".product-card", {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
          })
        }
      }, { scope: containerRef, dependencies: [isLoading] })

  return (
      <div className='' ref={containerRef}>
          <div className='px-6 lg:px-20 py-6 lg:py-10'>
            <div>
              <h1 className='text-[57px] font-medium mb-12'>Yard</h1>
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
                    <div className="relative overflow-hidden rounded-[20px]">
                      <Image 
                          src={product.image} 
                          alt={product.name} 
                          className='w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110' 
                      />
                      {product.isNew && (
                          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[14px] font-medium text-black">
                              New
                          </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className='text-[18px] font-medium text-black'>{product.name}</h2>
                      <p className='text-[16px] text-gray-500'>Posted by {product.PostedBy}</p>
                      <p className='text-[16px] font-bold mt-1'>{product.price}</p>
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
