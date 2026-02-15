'use client'

import React, { useState } from 'react'
import { Plus, ChevronDown, Loader2, X } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { useUploadThing } from '@/lib/uploadthing'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ProductCondition, ProductStatus } from '@/server/enums'

export default function PostProduct() {
  const router = useRouter()
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null, null])
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null, null])
  const [isUploading, setIsUploading] = useState(false)

  const { data: status, isLoading: isLoadingStatus } = trpc.vendor.checkStatus.useQuery()
  const { data: categories, isLoading: isLoadingCategories } = trpc.category.list.useQuery()
  const utils = trpc.useUtils()

  const createProduct = trpc.product.create.useMutation({
    onSuccess: () => {
      toast.success("Product posted! It's now live on the marketplace.")
      utils.product.list.invalidate()
      router.push('/dashboard/vendor')
    },
    onError: (error) => {
      console.error('Submission error:', error)
      toast.error(error.message || "Post failed. Please verify your product details.")
    }
  })

  const { startUpload } = useUploadThing('productImage', {
    onUploadError: (error) => {
      console.error('UploadThing: Error triggered', error)
      toast.error(`Upload error: ${error.message}`)
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
      price: '',
      description: '',
      categoryId: '',
    },
    onSubmit: async ({ value }) => {
      const activeImages = images.filter((img): img is File => img !== null)
      
      if (activeImages.length === 0) {
        toast.error('Please upload at least one image')
        return
      }

      const priceNum = parseFloat(value.price)
      if (isNaN(priceNum)) {
        toast.error('Please enter a valid price')
        return
      }

      setIsUploading(true)

      const uploadWithRetry = async (files: File[], retries = 3, delay = 2000): Promise<any[]> => {
        try {
          const result = await startUpload(files)
          if (!result) throw new Error('Upload handshake failed')
          return result
        } catch (error: any) {
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay))
            return uploadWithRetry(files, retries - 1, delay * 2)
          }
          throw error
        }
      }

      try {
        const uploadedResult = await uploadWithRetry(activeImages)
        const imageUrls = uploadedResult.map(res => res.ufsUrl)

        await createProduct.mutateAsync({
          name: value.name,
          description: value.description,
          price: priceNum,
          images: imageUrls,
          condition: ProductCondition.NEW,
          categoryId: value.categoryId || undefined,
          status: ProductStatus.ACTIVE,
        })
      } catch (error: any) {
        console.error('Fatal submission error:', error)
        toast.error(error.message || 'An unexpected error occurred during posting')
      } finally {
        setIsUploading(false)
      }
    }
  })

  if (isLoadingStatus) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#8E74FF]" />
      </div>
    )
  }

  if (!status?.isVendor) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="bg-white p-12 rounded-[40px] border border-[#E5E0FF] shadow-sm text-center space-y-8 max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-[#F9F8FF] rounded-full flex items-center justify-center mx-auto">
            <Plus className="text-[#8E74FF]" size={40} />
          </div>
          <div className="space-y-4">
            <h1 className="text-[32px] font-bold text-[#140033]">You haven't set up your store yet</h1>
            <p className="text-[18px] text-[#140033]/60 leading-relaxed">
              Before you can post your first product, you need to create your store profile. This only takes a minute!
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/vendor/profile')}
            className="w-full bg-[#8E74FF] hover:bg-[#7C5CFF] text-white font-bold py-6 rounded-full transition-all text-[20px]"
          >
            Go to Profile to Set Up Store
          </button>
        </div>
      </div>
    )
  }


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    const newImages = [...images]
    const newPreviews = [...previews]
    
    // Cleanup old preview if it exists
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]!)
    }

    newImages[index] = file
    newPreviews[index] = URL.createObjectURL(file)
    
    setImages(newImages)
    setPreviews(newPreviews)
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    const newPreviews = [...previews]
    
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]!)
    }

    newImages[index] = null
    newPreviews[index] = null
    
    setImages(newImages)
    setPreviews(newPreviews)
  }

  return (
    <div className="min-h-screen bg-[#FBF9FF] pb-20">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16"
        >
          {/* Left Column: Images */}
          <div className="space-y-8">
            <div className="flex flex-col items-center gap-4">
              {/* Main Large Image */}
              <div className="w-full aspect-square bg-white border-2 border-dashed border-[#E5E0FF] rounded-[24px] relative overflow-hidden group flex items-center justify-center">
                {previews[0] ? (
                  <>
                    <Image src={previews[0]} alt="Main product" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(0)}
                      className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex items-center justify-center cursor-pointer transition-all hover:bg-[#F9F8FF]">
                    <Plus className="text-[#140033]" size={80} strokeWidth={1.5} />
                    <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 0)} className="hidden" />
                  </label>
                )}
              </div>
              <p className="text-sm font-medium text-[#140033]">Photo must be less than 10MB</p>
            </div>

            {/* Supplementary Images Grid */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="aspect-square bg-white border-2 border-dashed border-[#E5E0FF] rounded-[16px] relative overflow-hidden group flex items-center justify-center">
                  {previews[idx] ? (
                    <>
                      <Image src={previews[idx]!} alt={`Product preview ${idx}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors z-10"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full flex items-center justify-center cursor-pointer transition-all hover:bg-[#F9F8FF]">
                      <Plus className="text-[#140033]" size={24} strokeWidth={1.5} />
                      <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, idx)} className="hidden" />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="flex flex-col gap-6 pt-2">
            <form.Field name="name">
              {(field) => (
                <div className="relative">
                  <input
                    id="title"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full bg-[#EDEDED] rounded-[24px] px-8 py-6 text-[#140033] placeholder:text-[#140033]/40 focus:outline-none text-[18px]"
                  />
                  {!field.state.value && (
                    <label htmlFor="title" className="absolute left-8 top-1/2 -translate-y-1/2 text-[#140033]/40 text-[18px] pointer-events-none">
                      Title
                    </label>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="price">
              {(field) => (
                <div className="relative">
                  <span className="absolute left-8 top-1/2 -translate-y-1/2 text-[#140033] font-medium text-[18px]">
                    ₦
                  </span>
                  <input
                    id="price"
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full bg-[#EDEDED] rounded-[24px] pl-14 pr-8 py-6 text-[#140033] placeholder:text-[#140033]/40 focus:outline-none text-[18px]"
                  />
                  {!field.state.value && (
                    <label htmlFor="price" className="absolute left-14 top-1/2 -translate-y-1/2 text-[#140033]/40 text-[18px] pointer-events-none">
                      Price
                    </label>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <div className="relative">
                  <textarea
                    id="description"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={6}
                    className="w-full bg-[#EDEDED] rounded-[24px] px-8 py-6 text-[#140033] placeholder:text-[#140033]/40 focus:outline-none text-[18px] resize-none"
                  />
                  {!field.state.value && (
                    <label htmlFor="description" className="absolute left-8 top-6 text-[#140033]/40 text-[18px] pointer-events-none">
                      Description
                    </label>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="categoryId">
              {(field) => (
                <div className="relative">
                  <select
                    id="category"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full appearance-none bg-[#EDEDED] rounded-[24px] px-8 py-6 text-[#140033]/40 focus:text-[#140033] focus:outline-none text-[18px] cursor-pointer"
                  >
                    <option value="" disabled>Category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {!field.state.value && (
                     <label htmlFor="category" className="absolute left-8 top-1/2 -translate-y-1/2 text-[#140033]/40 text-[18px] pointer-events-none">
                        Category
                     </label>
                  )}
                  <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-[#140033] pointer-events-none" size={24} />
                </div>
              )}
            </form.Field>

            <div className="mt-4">
              <button
                type="submit"
                disabled={isUploading || createProduct.isPending}
                className="w-full bg-[#8E74FF] hover:bg-[#7C5CFF] disabled:bg-[#8E74FF]/50 text-white font-medium py-6 rounded-full transition-all text-[20px] flex items-center justify-center gap-3"
              >
                {isUploading || createProduct.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    {isUploading ? 'Uploading...' : 'Going Live...'}
                  </>
                ) : (
                  'Confirm and go live'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
