"use client"

import { useForm, useStore } from "@tanstack/react-form"
import { z } from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { trpc } from "@/lib/trpc"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address").refine((email) => {
    const studentPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.edu\.ng$/;
    return studentPattern.test(email);
  }, {
    message: "Only verified student emails from Nigerian Universities (.edu.ng) are allowed."
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const SignupForm = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    validators: {
      onChange: signupSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const { error } = await authClient.signUp.email({
          email: value.email,
          password: value.password,
          name: value.username,
          callbackURL: "/login",
        })

        if (error) {
          toast.error(error.message || "Signup failed. Please try again.")
        } else {
          toast.success("Account created! You can now log in.")
          router.push("/login")
        }
      })
    },
  })

  const username = useStore(form.store, (state) => state.values.username)
  const { data: usernameStatus, isLoading: isCheckingUsername } = trpc.user.checkUsername.useQuery(
    { username },
    { enabled: username.length >= 3 }
  )

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
          <form.Field name="username">
            {(field) => (
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Username"
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
                {username.length >= 3 && (
                   <p className={`text-sm px-2 ${isCheckingUsername ? "text-gray-500" : usernameStatus?.available ? "text-green-500" : "text-red-500"}`}>
                     {isCheckingUsername ? "Checking availability..." : usernameStatus?.available ? "Username is available" : "Username is taken"}
                   </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Email Address ( preferably student email )"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-[422px] h-[70px] rounded-[22px] bg-[#F2F2F2] px-6 focus-visible:ring-[#9369FF]"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm px-2 text-wrap w-[422px]">
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
                disabled={!canSubmit || isSubmitting || isPending || !usernameStatus?.available}
                className="rounded-[22px] px-6 py-2 text-[18px] bg-[#9369FF] w-[422px] h-[70px]"
              >
                {isSubmitting || isPending ? "Creating Account..." : "Get Started"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
      <div className="flex justify-center py-6">
        <p className="text-center text-[20px] font-normal text-[#828181]">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}
