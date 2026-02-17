"use client"

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'

import Step1Img from '@/images/howitworks1.png' 
import Step2Img from '@/images/howitworks2.png' 
import Step3Img from '@/images/howitworks3.png' 

const steps = [
  {
    image: Step1Img,
    title: "1. Clear Your Stash",
    description: "Take a photo of the gear, books, or decor you're done with."
  },
  {
    image: Step2Img,
    title: "2. Claim Your Yardage",
    description: "Browse the \"Yard\" for items posted by students just a few dorms away."
  },
  {
    image: Step3Img,
    title: "3. The Handover",
    description: "Chat in-app, meet in a safe campus spot, and complete the deal. No shipping, no waiting, just easy exchanges."
  }
]

const differences = [
  {
    title: "Verified Campus Community",
    description: "No bots, no scammers. Yardage is strictly for students. By requiring a university email, we ensure that every \"find\" happens within your trusted campus circle."
  },
  {
    title: "Zero-Hassle Selling",
    description: "We know you're busy. Our \"Fast-Post\" system allows you to list your items in under 60 seconds. Snap, price, and post—it's that simple."
  },
  {
    title: "Sustainable Savings",
    description: "Why buy new when you can buy local? Yardage helps students save money and reduces campus waste by keeping perfectly good gear in circulation."
  }
]

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#FDFBFF]">
      <Navbar />
      
      <main className="max-w-[1200px] mx-auto px-6 py-12 lg:py-24 space-y-24">
        <h1 className="text-[32px] md:text-[48px] font-bold leading-tight text-black">
          How It Works
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <div key={index} className="space-y-6">
              <div className="relative aspect-square w-full overflow-hidden rounded-[24px]">
                <Image 
                  src={step.image} 
                  alt={step.title} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-[18px] md:text-[20px] font-bold text-black">
                  {step.title}
                </h2>
                <p className="text-[16px] text-[#828181] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-12 space-y-12">
          <h2 className="text-[32px] md:text-[40px] font-bold text-black">
            What Makes Us Different?
          </h2>

          <div className="space-y-12 max-w-[900px]">
            {differences.map((diff, index) => (
              <div key={index} className="space-y-3">
                <p className="text-[18px] md:text-[20px] font-bold text-black flex flex-col md:flex-row md:items-baseline gap-2">
                  <span>{diff.title}:</span>
                  <span className="font-normal text-[#828181]">
                    {diff.description}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
