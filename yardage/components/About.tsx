import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import StudentHero from '@/images/about1.png'
import ExchangeHand from '@/images/about2.png'
import { Button } from './ui/button'
import Link from 'next/link'

export default function About() {
  return (  
    <div className='min-h-screen bg-[#FDFBFF]'>
        <Navbar />
        
        <div className='max-w-[1200px] mx-auto px-6 py-12 lg:py-24 space-y-32'>
            {/* Section 1: Hero */}
            <div className='flex flex-col lg:flex-row justify-between gap-12 lg:gap-24'>
                <div className='w-full lg:w-1/2 space-y-6'>
                    <h1 className='text-[32px] md:text-[48px] font-bold leading-[1.1] text-black'>
                        The company that gives students the power of sales
                    </h1>
                    <p className='text-[18px] md:text-[20px] text-[#828181] leading-relaxed max-w-[500px]'>
                        We all have been students before and we understand how difficult it is to make thrift sales or 
                        have a platform for your mini business, now we are fixing it.
                    </p>
                </div>
                <div className='w-full lg:w-1/2'>
                    <div className="relative aspect-square w-full max-w-[460px] mx-auto overflow-hidden rounded-[32px]">
                        <Image 
                            src={StudentHero} 
                            alt="Student using Yardage" 
                            fill 
                            className='object-cover'
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: The Mission */}
            <div className='flex flex-col-reverse lg:flex-row justify-between gap-12 lg:gap-24'>
                <div className='w-full lg:w-1/2'>
                    <div className="relative aspect-square w-full max-w-[460px] mx-auto overflow-hidden rounded-[32px]">
                        <Image 
                            src={ExchangeHand} 
                            alt="Hand exchange" 
                            fill 
                            className='object-cover'
                        />
                    </div>
                </div>
                <div className='w-full lg:w-1/2 space-y-6'>
                    <h2 className='text-[32px] md:text-[40px] font-bold text-black'>
                        The Mission
                    </h2>
                    <p className='text-[18px] md:text-[20px] text-[#828181] leading-relaxed'>
                        At Yardage, we believe that every dorm room has a story and every student has a "stash." 
                        Whether it's a textbook you no longer need, a mini-fridge that won't fit in your next apartment, 
                        or a hidden gem you're looking to find, our mission is to make campus exchange hassle-free. 
                        We've replaced shady meetups and cluttered social media groups with a clean, secure, 
                        and student-only marketplace.
                    </p>
                </div>
            </div>

            {/* Section 3: Why Yardage? */}
            <div className='text-start space-y-8 max-w-[900px] mx-auto'>
                <h2 className='text-[32px] md:text-[40px] font-bold text-black'>
                    Why "Yardage"?
                </h2>
                <p className='text-[18px] md:text-[20px] text-[#828181] leading-relaxed italic'>
                    The name Yardage represents two things: the traditional "yard sale" spirit of finding great deals 
                    and the physical "yardage" (distance) that connects us across campus. We are closing the gap 
                    between the things you want to get rid of and the people who need them most.
                </p>
            </div>

            {/* Section 4: CTA Cards */}
            <div className='bg-[#F2F2F2] rounded-[40px] p-4 lg:p-12'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
                    {/* Join Card */}
                    <div className=' rounded-l-[32px] md:rounded-r-none rounded-t-[32px] md:rounded-t-[32px] p-10 lg:p-16 space-y-8 border-r-0 md:border-r border-gray-100'>
                        <div className="w-10 h-10 rounded-full bg-[#00D756]" />
                        <div className="space-y-4">
                            <h3 className="text-[24px] md:text-[28px] font-bold leading-tight">
                                You want to make impact? Join us.
                            </h3>
                            <p className="text-[18px] text-[#828181]">
                                You'd like to work with us or volunteer? join here
                            </p>
                        </div>
                        <Button className="bg-black text-white rounded-full px-8 py-6 text-[16px] transition-transform hover:scale-105">
                            Join here
                        </Button>
                    </div>

                    {/* Report Card */}
                    <div className=' rounded-r-[32px] md:rounded-l-none rounded-b-[32px] md:rounded-b-[32px] p-10 lg:p-16 space-y-8'>
                        <div className="w-10 h-10 rounded-full bg-[#FF3D64]" />
                        <div className="space-y-4">
                            <h3 className="text-[24px] md:text-[28px] font-bold leading-tight">
                                Find any issue or problems
                            </h3>
                            <p className="text-[18px] text-[#828181]">
                                If there is something you find weird report here
                            </p>
                        </div>
                        <Button className="bg-[#8E74FF] hover:bg-[#7C5CFF] text-white rounded-full px-12 py-6 text-[16px] transition-transform hover:scale-105">
                            Report
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <Footer />
    </div>
  )
}
