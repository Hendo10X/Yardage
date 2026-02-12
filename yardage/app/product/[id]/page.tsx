"use client"

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Navbar from "@/components/buyer/navbar"
import { Footer } from "@/components/Footer"
import Product1 from "@/images/product1.png"
import Product2 from "@/images/product2.png"
import Product3 from "@/images/product3.png"
import Product4 from "@/images/product4.png"
import { useParams } from 'next/navigation'

export default function ProductPage() {
  const params = useParams()
  const [selectedImage, setSelectedImage] = useState(Product1)
  
  return (
    <div className='min-h-screen bg-[#FDFBFF]'>
      <Navbar />
      <div className='px-6 lg:px-20 py-6 lg:py-10 max-w-[1400px] mx-auto lg:h-[140vh]'>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Left Column - Main Image */}
            <div className="w-full lg:w-1/2">
                <div className="relative aspect-square w-full bg-[#E5E5E5] rounded-[20px] overflow-hidden">
                    <Image 
                        src={selectedImage} 
                        alt="Clip-On Bedside Shelf" 
                        fill
                        className="object-cover transition-all duration-300"
                        priority
                    />
                </div>
            </div>

            {/* Right Column - Details */}
            <div className="w-full lg:w-1/2 flex flex-col pt-4">
                <h1 className="text-[48px] leading-[1.1] font-medium text-black mb-4">
                    Clip-On<br />Bedside Shelf
                </h1>

                <div className="flex items-center gap-4 mb-8">
                    <p className="text-[18px] text-[#666666]">Posted by Ada</p>
                    <Link href="#" className="text-[18px] text-[#9369FF] hover:underline">
                        Visit profile
                    </Link>
                </div>

                <div className="space-y-6 text-[18px] leading-[1.6] text-[#1A1A1A] mb-8">
                    <p>
                        Step into sunshine. The Model 000 in Sunflower Yellow brings everyday comfort and effortless style to your routine — lightweight, breathable, and built to keep up with you from morning walks to late nights out.
                    </p>
                </div>

                <div className="space-y-2 mb-10">
                    <p className="text-[18px] font-medium">Quality: 5.6/10</p>
                    <p className="text-[18px] font-medium">Period of usage: 5months</p>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-4 mb-12">
                     {[Product1, Product2, Product3, Product4].map((img, index) => (
                        <div 
                            key={index} 
                            onClick={() => setSelectedImage(img)}
                            className={`relative w-[80px] h-[80px] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                                selectedImage === img ? 'ring-2 ring-[#9369FF]' : 'opacity-60 hover:opacity-100'
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

                {/* Actions */}
                <div className="flex flex-col gap-4 max-w-[400px]">
                    <Button 
                        variant="secondary" 
                        className="w-full h-[56px] rounded-full text-[16px] font-medium bg-[#F0F0F0] hover:bg-[#E0E0E0] text-black"
                    >
                        Add to wishlist
                    </Button>
                    <Button 
                        variant="secondary"
                        className="w-full h-[56px] rounded-full text-[16px] font-medium bg-[#F0F0F0] hover:bg-[#E0E0E0] text-black"
                    >
                        Negotiate price
                    </Button>
                    <Button 
                        className="w-full h-[56px] rounded-full text-[16px] font-medium bg-black hover:bg-neutral-800 text-white"
                    >
                        Buy for N15,000
                    </Button>
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
    )
}
