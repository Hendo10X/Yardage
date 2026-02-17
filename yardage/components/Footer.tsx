import Image from 'next/image'
import Logo from "@/images/logo-dark (2).svg"
import Link from 'next/link'

export default function Footer() {
  return (
    <div className='flex flex-col items-center h-[455px] justify-center py-12 px-6 md:px-14 bg-[#0A0A0A]'>
        <div className='flex flex-col items-center justify-center gap-4'>
            <Image src={Logo} alt="Logo" width={200} height={111} className="" />
            <p className='text-[19px] font-bold flex gap-16 text-white py-10'>
                <Link href="">Twitter</Link>
                <Link href="">Instagram</Link>
                <Link href="">Facebook</Link>
            </p>
        </div>
    </div>
  )
}
