import { SignupForm } from "@/components/UserAccounts/SignupForm"
import Image from "next/image"
import Logo from "@/images/Logo.svg"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const SignupPage = () => {
  return (
    <div className="h-screen py-12 px-6 md:px-14 bg-[#F9F3FD]">
      <Link href="/" className="text-[14px] font-normal text-left text-[#828181] flex items-center gap-2"> <ArrowLeft /> Back</Link>
        <div className="flex flex-col items-center justify-center gap-6 py-8">
          <div className="flex flex-col items-start justify-start gap-6">
            <div className="flex flex-col items-start gap-3">
            <Image src={Logo} alt="Logo" width={100} height={100} />
            <h1 className="text-[44px] font-bold">Get Started</h1>
            <p className="text-[18px] font-normal text-[#828181] flex flex-col gap-1 leading-[90%]">
              <span className="">Create an account to get started, use your </span> 
              <span className="">student email for more discounts and offers</span>
            </p> 
          </div>
           <SignupForm />
          </div>
        </div>
    </div>
  )
}

export default SignupPage
