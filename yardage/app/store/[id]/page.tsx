"use client"

import StoreProfile from "@/components/buyer/StoreProfile"
import { useParams } from "next/navigation"

export default function StorePage() {
  const params = useParams()
  const storeId = params.id as string

  return <StoreProfile storeId={storeId} />
}
