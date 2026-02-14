'use client'

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { useUploadThing } from '@/lib/uploadthing'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Loader2, Plus, X } from 'lucide-react'
import Image from 'next/image'

export default function CreateStore() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  const utils = trpc.useUtils()
  
  const { startUpload } = useUploadThing('productImage', { // Using productImage since it's already configured
    onUploadError: (error) => {
      toast.error(`Upload error: ${error.message}`)
    },
  })

  const createStore = trpc.store.create.useMutation({
    onSuccess: () => {
      toast.success('Store created successfully!')
      utils.vendor.checkStatus.invalidate()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create store')
    }
  })

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      setIsUploading(true)
      try {
        let imageUrl = undefined
        if (image) {
          const result = await startUpload([image])
          if (result && result[0]) {
            imageUrl = result[0].ufsUrl
          }
        }

        await createStore.mutateAsync({
          name: value.name,
          description: value.description,
          image: imageUrl,
        })
      } catch (error: any) {
        console.error('Store creation error:', error)
        toast.error(error.message || 'An unexpected error occurred')
      } finally {
        setIsUploading(false)
      }
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (preview) URL.revokeObjectURL(preview)
    
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview)
    setImage(null)
    setPreview(null)
  }

  return (
    <div className="max-w-[800px] mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-[40px] font-bold text-[#140033] mb-4">Set up your vendor profile</h1>
        <p className="text-[18px] text-[#140033]/60">Fill in these details to start posting products on Yardage</p>
      </div>

      <form 
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-8 bg-white p-10 rounded-[32px] shadow-sm border border-[#E5E0FF]"
      >
        {/* Profile Image */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-[#E5E0FF] relative overflow-hidden group flex items-center justify-center bg-[#F9F8FF]">
            {preview ? (
              <>
                <Image src={preview} alt="Store logo" fill className="object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                >
                  <X size={24} />
                </button>
              </>
            ) : (
              <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-[#F0EEFF] transition-colors">
                <Plus className="text-[#8E74FF]" size={32} />
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-sm font-medium text-[#140033]/60">Upload store logo or banner (optional)</p>
        </div>

        <div className="space-y-6">
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <label className="text-[18px] font-semibold text-[#140033] ml-2">Store Name</label>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., Ada's Thrift Shop"
                  className="w-full bg-[#EDEDED] rounded-[24px] px-8 py-6 text-[18px] text-[#140033] focus:outline-none focus:ring-2 focus:ring-[#8E74FF]/20"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <label className="text-[18px] font-semibold text-[#140033] ml-2">Description</label>
                <textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Tell buyers a bit about your store..."
                  rows={4}
                  className="w-full bg-[#EDEDED] rounded-[24px] px-8 py-6 text-[18px] text-[#140033] focus:outline-none focus:ring-2 focus:ring-[#8E74FF]/20 resize-none"
                />
              </div>
            )}
          </form.Field>
        </div>

        <button
          type="submit"
          disabled={isUploading || createStore.isPending}
          className="w-full bg-[#8E74FF] hover:bg-[#7C5CFF] disabled:bg-[#8E74FF]/50 text-white font-bold py-6 rounded-full transition-all text-[20px] flex items-center justify-center gap-3"
        >
          {isUploading || createStore.isPending ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Creating your store...
            </>
          ) : (
            'Create Store Profile'
          )}
        </button>
      </form>
    </div>
  )
}
