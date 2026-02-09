"use client"

import React, { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const products = [
  { id: 1, src: '/images/notebook.png', alt: 'Notebook' },
  { id: 2, src: '/images/lamp.png', alt: 'Lamp' },
  { id: 3, src: '/images/chair.png', alt: 'Chair' },
  { id: 4, src: '/images/phone.png', alt: 'Phone' },
  { id: 5, src: '/images/headphones.png', alt: 'Headphones' },
]

export const Carousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!scrollRef.current) return

    const scrollWidth = scrollRef.current.scrollWidth
    const containerWidth = scrollRef.current.offsetWidth

    // Infinite loop animation
    gsap.to(scrollRef.current, {
      x: -(scrollWidth / 2),
      duration: 20,
      ease: 'none',
      repeat: -1,
    })
  }, { scope: scrollRef })

  return (
    <div className='w-full py-14 overflow-hidden'>
      <div 
        ref={scrollRef}
        className='flex gap-6'
        style={{ width: 'max-content' }}
      >
        {/* Render twice for infinite loop */}
        {[...products, ...products].map((product, index) => (
          <div 
            key={`${product.id}-${index}`}
            className='relative w-[280px] h-[280px] shrink-0'
          >
            <Image 
              src={product.src} 
              alt={product.alt} 
              fill
              className='object-cover'
            />
          </div>
        ))}
      </div>
    </div>
  )
}

