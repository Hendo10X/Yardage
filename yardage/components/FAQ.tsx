"use client"

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const faqs = [
  {
    question: "Who can use Yardage?",
    answer: "Yardage is exclusively for university students. To keep our community safe and relevant, you must sign up using a valid .edu (or your specific university domain) email address. This ensures you're only buying from and selling to fellow students."
  },
  {
    question: "Does it cost anything to list an item?",
    answer: "No. It is completely free to list your \"stash\" on Yardage. We believe students should keep 100% of their earnings. There are no hidden listing fees or commissions."
  },
  {
    question: "How do I get paid?",
    answer: "To keep things hassle-free, Yardage currently facilitates the connection, while the transaction happens directly between the buyer and seller. Most students prefer using cash or popular digital payment apps during the physical handover."
  },
  {
    question: "Where should I meet the buyer/seller?",
    answer: "Safety first! We recommend meeting in well-lit, high-traffic campus locations during daylight hours—think the student union, the library lobby, or near campus security hubs. Never invite a stranger directly to your dorm room."
  },
  {
    question: "What kind of items can I sell?",
    answer: "If it fits in a dorm or helps with student life, you can sell it! Common items include textbooks, electronics, mini-fridges, dorm decor, and university apparel. Please check our community guidelines for a list of prohibited items (like hazardous materials)."
  },
  {
    question: "How do I know if an item is still available?",
    answer: "Our \"Yard\" feed is updated in real-time. Once a seller marks an item as \"Sold\" in their dashboard, it is instantly removed from the public feed so you don't waste time messaging for items that are gone."
  },
  {
    question: "What if I can't find my university on the list?",
    answer: "We are rolling out Yardage campus-by-campus to ensure a great experience for everyone. If your school isn't listed yet, join our Waitlist, and we'll notify you as soon as we \"open the Yard\" at your location!"
  }
]

export default function FAQ() {
  return (
    <div className="min-h-screen bg-[#FDFBFF]">
      <Navbar />
      
      <main className="max-w-[1200px] mx-auto px-6 py-12 lg:py-24">
        <h1 className="text-[32px] md:text-[48px] font-bold leading-tight text-black mb-16 max-w-[400px]">
          Frequently Asked Questions
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-12 lg:gap-y-16">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-[18px] md:text-[20px] font-bold text-black">
                {faq.question}
              </h2>
              <p className="text-[16px] md:text-[17px] text-[#828181] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
