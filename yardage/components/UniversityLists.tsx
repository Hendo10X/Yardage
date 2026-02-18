"use client"

import React from 'react'
import Logo from "@/images/Logo.svg"
import Image from "next/image"
import Link from "next/link"
import { trpc } from "@/lib/trpc"

export default function UniversityLists() {
  const { data: universities, isLoading } = trpc.user.listUniversities.useQuery()

  return (
    <div className="min-h-screen bg-[#FAF7FF] px-6 md:px-14 lg:px-28 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-24">
        <Link href="/">
          <Image src={Logo} alt="Logo" width={120} height={40} className="w-auto h-8 md:h-10" />
        </Link>
        <Link href="/request-spot" className="text-[14px] md:text-[16px] text-[#140033] opacity-60 hover:opacity-100 transition-opacity underline decoration-1 underline-offset-4">
          Request for a spot
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-[#140033] mb-16 leading-tight max-w-[500px]">
        Universities active for sales and purchase
      </h1>

      {/* List */}
      <div className="flex flex-col gap-10">
        {isLoading ? (
          // Skeletons
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 w-64 bg-gray-200 animate-pulse rounded" />
          ))
        ) : universities?.length === 0 ? (
          <p className="text-[#140033]/40">No universities active yet.</p>
        ) : (
          universities?.map((uni) => (
            <div key={uni.id} className="text-[18px] md:text-[22px] font-medium text-[#140033] hover:translate-x-2 transition-transform cursor-default">
              {uni.name}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
