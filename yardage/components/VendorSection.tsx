import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

export const VendorSection = () => {
  return (
    <div className='flex flex-col items-center justify-center py-12 px-6 md:px-28'>
        <div className='bg-[#F2F2F2] w-full p-10 lg:p-30 rounded-[16px] flex flex-col items-center md:flex-row lg:gap-58 gap-20'>
            <div className='gap-4'>
                <div className='h-[42px] w-[42px] rounded-full bg-[#FFA500] py-2'></div>
                <h1 className='text-[24px] font-medium py-2'>Buyers</h1>
                <p className='text-[18px] text-[#828181] pb-6 flex flex-col gap-1'>
                    <span>Wanna buy stuffs, second hand or brand </span> 
                    <span> new stuffs, sign-up or login now</span>
                </p>
                <Button className='text-white rounded-full px-6 py-2 text-[18px]'>
                    <Link href="/login">
                        Get Started
                    </Link>
                </Button>
            </div>
            <div className=''>
                <div className='h-[42px] w-[42px] rounded-full bg-[#6982FF] py-2'></div>
                <h1 className='text-[24px] font-medium py-2'>Vendors</h1>
                <p className='text-[18px] text-[#828181] pb-6 flex flex-col gap-1'>
                   <span>Wanna sell your merchandise and products </span>
                   <span>while, join now</span>
                </p>
                <Button className='text-white  bg-[#9369FF] rounded-full px-6 py-2 text-[18px]'>
                    <Link href="/login">
                        Get Started
                    </Link>
                </Button>
            </div>
        </div>
    </div>
  )
}
