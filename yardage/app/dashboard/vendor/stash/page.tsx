"use client"

import { trpc } from '@/lib/trpc'
import Image from 'next/image'
import Link from 'next/link'
import Icon1 from "@/images/icon1.svg"
import Icon2 from "@/images/icon2.svg"
import Icon3 from "@/images/icon3.svg"
import Icon4 from "@/images/icon4.svg"
import ActiveItems from './ActiveItems'

const Stash = () => {
  const { data: stats, isLoading } = trpc.product.getStashStats.useQuery()

  const cards = [
    {
        id: 1,
        icon: Icon1,
        label: "Active",
        value: stats?.active.toString() || "0",
        description: "(items currently live)",
        color: "bg-[#EFEFEF]"
    },
    {
        id: 2,
        icon: Icon2,
        label: "Pending",
        value: stats?.draft.toString() || "0",
        description: "person",
        color: "bg-[#EFEFEF]"
    },
    {
        id: 3,
        icon: Icon3,
        label: "Sold",
        value: stats?.sold.toString() || "0",
        description: "(your total success)",
        color: "bg-[#EFEFEF]"
    },
    {
        id: 4,
        icon: Icon4,
        label: "Earned",
        value: `N${stats?.totalEarned.toLocaleString() || "0"}`,
        description: "",
        color: "bg-[#EFEFEF]"
    }
  ]

  return (
    <div className='px-6 lg:px-20 py-6 lg:py-10 bg-white min-h-screen'>
        <div>
            <h1 className='md:text-[40px] font-bold mb-10 text-[30px]'>My stash</h1>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-[#EFEFEF] p-6 rounded-[22px] h-[160px] animate-pulse" />
                    ))
                ) : cards.map((item) => (
                    <div 
                        key={item.id} 
                        className={`${item.color} p-6 rounded-[22px] flex flex-col gap-15 hover:scale-[1.02] transition-transform cursor-pointer`}
                    >
                        <div className="w-[48px] h-[48px] flex items-center justify-center">
                            <Image src={item.icon} alt={item.label} className="" />
                        </div>
                        
                        <div className="flex gap-1 items-center">
                            <p className="text-[16px] md:text-[18px] text-[#3C3B3B] tracking-wider">
                                {item.label}:
                            </p> 
                            <p className="text-[16px] md:text-[18px] text-[#3C3B3B]">{item.value}</p>
                            <p className="text-[16px] md:text-[18px] text-[#3C3B3B]">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
             <ActiveItems />
        </div>
    </div>
  )
}

export default Stash