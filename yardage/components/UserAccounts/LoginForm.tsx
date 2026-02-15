"use client"

import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const LoginForm = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const { error } = await authClient.signIn.email({
          email: value.email,
          password: value.password,
          callbackURL: "/dashboard/buyer",
        })

        if (error) {
          toast.error(error.message || "Login failed. Please check your credentials and try again.")
        } else {
          toast.success("Successfully logged in. Welcome back!")
          router.push("/dashboard/buyer")
          router.refresh()
        }
      })
    },
  })

  return (
    <div className="">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="flex flex-col gap-6">
          <form.Field name="email">
            {(field) => (
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Email Address"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-[422px] h-[70px] rounded-[22px] bg-[#F2F2F2] px-6 focus-visible:ring-[#9369FF]"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm px-2">
                    {typeof field.state.meta.errors[0] === 'string' 
                      ? field.state.meta.errors[0] 
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Password"
                  type="password"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-[422px] h-[70px] rounded-[22px] bg-[#F2F2F2] px-6 focus-visible:ring-[#9369FF]"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm px-2">
                    {typeof field.state.meta.errors[0] === 'string' 
                      ? field.state.meta.errors[0] 
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting || isPending}
                className="rounded-[22px] px-6 py-2 text-[18px] bg-[#9369FF] w-[422px] h-[70px]"
              >
                {isSubmitting || isPending ? "Logging in..." : "Login"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
      <div className="flex justify-center py-6">
        <p className="text-center text-[20px] font-normal text-[#828181]">
          Don't have an account?{" "}
          <Link href="/signup" className="underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
