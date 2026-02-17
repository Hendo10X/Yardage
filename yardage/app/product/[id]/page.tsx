"use client"

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Navbar from "@/components/buyer/navbar"
import Footer from "@/components/Footer"
import { useParams, useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { Skeleton } from '@/components/ui/skeleton'
import { Package } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  
  const { data: product, isLoading, error } = trpc.product.getById.useQuery({ id: productId })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  const createOrder = trpc.order.create.useMutation({
    onSuccess: (order) => {
      toast.success("Order placed successfully! Check your dashboard for details.")
      router.push(`/dashboard/buyer/orders/${order?.id}`)
    },
    onError: (err) => {
      if (err.message.includes("UNAUTHORIZED")) {
        toast.error("Please login to buy products")
        router.push("/login")
      } else {
        toast.error(err.message || "Failed to place order")
      }
    }
  })

  const { data: isWishlisted, refetch: refetchWishlist } = trpc.wishlist.check.useQuery(
    { productId },
    { enabled: !!productId }
  )

  const toggleWishlist = trpc.wishlist.toggle.useMutation({
    onSuccess: (data) => {
      toast.success(data.added ? "Added to your wishlist!" : "Removed from your wishlist.")
      refetchWishlist()
    },
    onError: (err) => {
      toast.error(err.message || "Action failed. Please try again later.")
    }
  })
 
  const displayImage = selectedImage || (product?.images?.[0] ?? null)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBFF]">
        <Navbar />
        <div className="px-6 lg:px-20 py-6 lg:py-10 max-w-[1400px] mx-auto lg:h-[140vh]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Left Column: Image Skeleton */}
            <div className="w-full lg:w-1/2">
              <Skeleton className="aspect-square w-full rounded-[20px]" />
            </div>

            {/* Right Column: Details Skeleton */}
            <div className="w-full lg:w-1/2 flex flex-col pt-4 space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4 rounded-lg" />
                <Skeleton className="h-6 w-1/4 rounded-lg" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded-lg" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-24 rounded-lg" />
                  <Skeleton className="h-6 w-24 rounded-lg" />
                </div>
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-20 w-20 rounded-lg" />
                <Skeleton className="h-20 w-20 rounded-lg" />
              </div>
              <div className="space-y-4 max-w-[400px]">
                <Skeleton className="h-[56px] w-full rounded-full" />
                <Skeleton className="h-[56px] w-full rounded-full" />
                <Skeleton className="h-[56px] w-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FDFBFF]">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Package size={64} className="text-gray-300" />
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link href="/" className="text-[#8E74FF] hover:underline">Return to home</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleBuy = async () => {
    await createOrder.mutateAsync({
      items: [{ productId: product.id, quantity: 1 }]
    })
  }

  const handleWishlist = () => {
    toggleWishlist.mutate({ productId })
  }

  return (
    <div className='min-h-screen bg-[#FDFBFF]'>
      <Navbar />
      <div className='px-6 lg:px-20 py-6 lg:py-10 max-w-[1400px] mx-auto lg:h-[140vh]'>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Left Column - Main Image */}
            <div className="w-full lg:w-1/2">
                <div className="relative aspect-square w-full bg-[#E5E5E5] rounded-[20px] overflow-hidden">
                    {displayImage ? (
                      <Image 
                          src={displayImage} 
                          alt={product.name} 
                          fill
                          className="object-cover transition-all duration-300"
                          priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={80} className="text-gray-300" />
                      </div>
                    )}
                </div>
            </div>

            {/* Right Column - Details */}
            <div className="w-full lg:w-1/2 flex flex-col pt-4">
                <h1 className="text-[40px] leading-[1.1] font-medium text-black mb-4">
                    {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-8">
                    <p className="text-[14px] text-[#666666]">Posted by {product.store.name}</p>
                    <Link href="#" className="text-[14px] text-[#9369FF] hover:underline">
                        Visit profile
                    </Link>
                </div>

                <div className="space-y-6 text-[14px] md:text-[18px] leading-[1.6] text-[#1A1A1A] mb-8">
                    <p className="whitespace-pre-wrap">
                        {product.description || "No description provided."}
                    </p>
                </div>

                <div className="space-y-2 mb-10">
                    <p className="text-[14px] md:text-[16px] font-medium tracking-tight text-[#666666]">Condition: <span className="text-black capitalize">{product.condition.replace('_', ' ')}</span></p>
                    <p className="text-[14px] md:text-[16px] font-medium tracking-tight text-[#666666]">Category: <span className="text-black">{product.category?.name || 'Uncategorized'}</span></p>
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-4 mb-12 overflow-x-auto pb-2 scrollbar-hide">
                       {product.images.map((img, index) => (
                          <div 
                              key={index} 
                              onClick={() => setSelectedImage(img)}
                              className={`relative shrink-0 w-[80px] h-[80px] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                                  displayImage === img ? 'ring-2 ring-[#9369FF]' : 'opacity-60 hover:opacity-100'
                              }`}
                          >
                              <Image 
                                  src={img} 
                                  alt={`View ${index + 1}`} 
                                  fill
                                  className="object-cover"
                              />
                          </div>
                       ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-4 max-w-[400px]">
                    <Button 
                        variant="secondary" 
                        onClick={handleWishlist}
                        disabled={toggleWishlist.isPending}
                        className={`w-full h-[56px] rounded-full text-[16px] font-medium transition-all ${
                          isWishlisted 
                            ? "bg-[#9369FF] text-white hover:bg-[#8254ff]" 
                            : "bg-[#F0F0F0] hover:bg-[#E0E0E0] text-black"
                        }`}
                    >
                        {toggleWishlist.isPending ? "Updating..." : isWishlisted ? "In Wishlist" : "Add to wishlist"}
                    </Button>
                    <Button 
                        variant="secondary"
                        onClick={() => toast.info("Negotiation feature coming soon!")}
                        className="w-full h-[56px] rounded-full text-[16px] font-medium bg-[#F0F0F0] hover:bg-[#E0E0E0] text-black"
                    >
                        Negotiate price
                    </Button>
                    <Button 
                        onClick={handleBuy}
                        disabled={createOrder.isPending}
                        className="w-full h-[56px] rounded-full text-[16px] font-medium bg-black hover:bg-neutral-800 text-white disabled:opacity-50"
                    >
                        {createOrder.isPending ? "Processing..." : `Buy for ₦${product.price.toLocaleString()}`}
                    </Button>
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
    )
}
