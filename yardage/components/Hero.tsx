import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { Carousel } from './Carousel'

export const Hero = () => {
  return (
    <div className='flex flex-col h-screen'>
        <div className='flex flex-col px-4 md:px-14 lg:px-28 py-6 md:py-14'>
            <div className='flex flex-col gap-4'>
                <h1 className='md:text-[50px] text-[30px] font-bold flex flex-col leading-[100%]'>
                <span>Turn Dorm</span> 
                    <span className='text-primary'>Clutter Into Cash</span>
                </h1>
                <p className='md:text-[18px] text-[14px] text-[#828181] flex flex-col gap-0'>
                <span>The safest way to buy and sell textbooks, gadgets, </span> 
                <span>and furniture with students on your campus.</span> 
                <span>No shipping, no scams, just local trades.</span>
                </p>
            </div>
            <div className='mt-8'>
                <Button className='bg-[#9369FF] text-white rounded-full px-6 py-2 text-[18px]'>
                    <Link href="/signup">
                        Get Started
                    </Link>
                </Button>
            </div>
        </div>

    <Carousel />
    </div>
  )
}
