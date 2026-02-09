import { BookMarked, Lamp, Smartphone, Utensils } from 'lucide-react'


const features = [
    {   
        icons: Lamp,
        title: "Furniture",
        description: "Buy furniture's like chairs, tables and a full set here. ",
        color: "#D0BDFF"
    },
    {
        icons: Utensils,
        title: "Kitchen",
        description: "Buy utensils like cups,spoons and a kitchen tools here. ",
        color: "#FFCC6E"
    },
    {
        icons: Smartphone,
        title: "Gadgets",
        description: "Buy phones, headphones and fairly used tools and electronics",
        color: "#AFFF5A"
    },
    {
        icons: BookMarked,
        title: "Academics",
        description: "Past questions, textbooks and academic materials.",
        color: "#00D74C"
    }
]


export const FeatureSection = () => {
  return (
    <div className='px-6 md:px-28 py-6 md:py-28'>
        <div>
            <h1 className='flex flex-col font-bold text-[40px] md:text-[57px] leading-[100%]'>
                <span>Your school,</span> 
                <span className='text-primary'>your market.</span>
            </h1>
            <p className='py-8 leading-[100%] text-[18px] md:text-[20px] text-[#828181] flex flex-col gap-2'>
               <span>Buy, sell and easily without much hassle.</span> 
                <span>Find what you want with ease.</span>
            </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 py-12 w-full lg:w-[80%]'>
            {features.map((feature, index) => (
                <div key={index} className='flex flex-col gap-4'>
                    <div 
                        className='w-12 h-12 rounded-full flex items-center justify-center'
                        style={{ backgroundColor: feature.color }}
                    >
                        <feature.icons size={24} color='#000' strokeWidth={2.5} />
                    </div>
                    <h2 className='text-[24px] font-medium'>{feature.title}</h2>
                    <p className='text-[18px] text-[#828181] w-[80%] lg:w-[60%]'>{feature.description}</p>
                </div>
            ))}
        </div>
    </div>
  )
}
