"use client"

import { useFormContext, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"

export default function PersonalInfoStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Personal Information</h2>
      <p className="text-muted-foreground">Please provide your contact details.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john.doe@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <PhoneInput
                international
                defaultCountry="OM"
                value={value}
                onChange={onChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 input-focus"
              />
            </FormControl>
            {errors.phone && <FormMessage>{errors.phone.message?.toString()}</FormMessage>}
          </FormItem>
        )}
      />
    </div>
  )
}

