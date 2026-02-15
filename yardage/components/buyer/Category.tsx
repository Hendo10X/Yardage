
"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useBuyer } from "@/context/BuyerContext"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"

import categoryicon1 from "@/images/categoryicon1.svg"
import categoryicon2 from "@/images/categoryicon2.svg"
import categoryicon3 from "@/images/categoryicon3.svg"
import categoryicon4 from "@/images/categoryicon4.svg"
import categoryicon5 from "@/images/categoryicon5.svg"
import categoryicon6 from "@/images/categoryicon6.svg"
import categoryicon7 from "@/images/categoryicon7.svg"
import categoryicon8 from "@/images/categoryicon8.svg"


const categoryItems = [
  {
    icon: categoryicon1,
    name: "Academics",
  },
  {
    icon: categoryicon2,
    name: "Beddings",
  },
  {
    icon: categoryicon3,
    name: "Computing",
  },
  {
    icon: categoryicon4,
    name: "Dorm Decor",
  },
  {
    icon: categoryicon5,
    name: "Electronics",
  },
  {
    icon: categoryicon6,
    name: "Furniture",
  },
  {
    icon: categoryicon7,
    name: "Game Day Gear",
  },
  {
    icon: categoryicon8,
    name: "Household Appliances",
  },
]

export default function Category() {
  const router = useRouter()
  const { filters, setFilters } = useBuyer()
  const { data: categoriesData } = trpc.category.list.useQuery()

  const handleCategoryClick = (categoryName: string) => {
    const categoryId = categoriesData?.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase()
    )?.id

    if (categoryId) {
      setFilters({
        ...filters,
        category: categoryId
      })
      toast.success(`Filtering by ${categoryName}...`)
      router.push("/dashboard/buyer")
    }
  }

  return (
    <div className="px-6 lg:px-20 py-6 lg:py-10">
        <div>
            <h2 className="lg:text-[57px] text-[40px]  font-bold">Categories</h2>
        </div>

        <div className="py-4 lg:py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryItems.map((item, index) => (
              <div 
                key={index} 
                onClick={() => handleCategoryClick(item.name)}
                className="flex gap-8 flex-col bg-[#EFEFEF] p-6 rounded-[22px] cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <Image src={item.icon} alt={item.name} width={40} height={40} />
                <h2 className="text-[16px] font-medium">{item.name}</h2>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}
