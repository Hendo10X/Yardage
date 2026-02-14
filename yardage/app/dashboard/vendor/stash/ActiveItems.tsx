"use client"

import { trpc } from '@/lib/trpc'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export default function ActiveItems() {
  const { data, isLoading } = trpc.product.listMine.useQuery({
    limit: 50,
  })

  const items = data?.items || []

  return (
    <div className='py-12'>
        <h1 className='text-[32px] font-bold mb-10 text-black'>Active items</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12'>
            {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className='flex flex-col gap-4 animate-pulse'>
                        <div className="w-full aspect-[4/3] bg-gray-200 rounded-[28px]" />
                        <div className="h-6 bg-gray-200 rounded-md w-3/4" />
                        <div className="h-5 bg-gray-200 rounded-md w-1/4" />
                    </div>
                ))
            ) : (
                items.map((item: any) => (
                    <div key={item.id} className='flex flex-col gap-5'>
                        <div className='relative overflow-hidden rounded-[28px] aspect-[4/3]'>
                            <Image 
                                src={item.images?.[0] || "/placeholder-product.png"} 
                                alt={item.name} 
                                fill
                                className='w-full h-full object-cover cursor-pointer transition-transform duration-700 hover:scale-105' 
                            />
                        </div>
                        
                        <div className='flex flex-col gap-2 px-1'>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-[20px] font-bold text-black'>{item.name}</h2>
                                <div className='bg-[#9369FF] px-4 py-1 flex gap-1 items-center justify-center rounded-full'>
                                    <p className='text-[14px] font-medium text-white capitalize'>{item.status}</p>
                                    <ChevronDown className='w-4 h-4 text-white' />
                                </div>
                            </div>
                            
                            <div className='flex flex-col gap-1'>
                                <p className='text-[18px] font-medium text-[#828181]'>N{item.price.toLocaleString()}</p>
                                <Link href="">
                                    <p className='text-[13px] font-semibold text-[#9369FF] underline hover:text-[#7e52e6] transition-colors'>Change price</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  )
}
