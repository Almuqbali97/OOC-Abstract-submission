"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CheckCircle, ArrowRight, UserCheck, Search } from "lucide-react"
import { verifyMembership } from "@/lib/appwrite"

interface MembershipVerificationProps {
  onContinue: () => void
}


const formSchema = z.object({
  membershipId: z.string().min(1, "Membership ID is required"),
})

export default function MembershipVerification({ onContinue }: MembershipVerificationProps) {
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [membership, setMemebrship] = useState("")
console.log(membership);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      membershipId: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsVerifying(true)
    setError("")

    try {
      const member = await verifyMembership(values.membershipId)

      if (member) {
        setVerified(true)
        setMemebrship({
          id: member.membershipId,
          name: member.fullName,
          mobile: member.mobile,
          email: member.email,
        })
      } else {
        setError("Invalid membership ID. Please try again.")
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.")
    }

    setIsVerifying(false)
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {!verified ? (
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle className="text-2xl text-center">OOC Membership Verification</CardTitle>
              <CardDescription className="text-center">Please enter your OOC membership ID to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="membershipId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Membership ID</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="Enter your OOC membership ID" className="pl-10" {...field} />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-medium text-destructive"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button type="submit" className="w-full rounded-full" disabled={isVerifying}>
                    {isVerifying ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Verifying...
                      </div>
                    ) : (
                      "Verify Membership"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card className="gradient-border">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="rounded-full bg-gradient-to-r from-green-100 to-green-200 p-3"
                >
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </motion.div>
              </div>
              <CardTitle className="text-2xl text-center">Membership Verified!</CardTitle>
              <CardDescription className="text-center">
                Your OOC membership has been successfully verified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-primary/5 p-5 rounded-lg border border-primary/20"
              >
                <div className="flex items-center mb-3">
                  <UserCheck className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-medium">Membership Details</h3>
                </div>
                <div className="space-y-3 pl-7">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">ID:</p>
                    <p className="text-sm font-medium">{membership.id}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Name:</p>
                    <p className="text-sm font-medium">{membership.name}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Mobile:</p>
                    <p className="text-sm font-medium">{membership.mobile}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Email:</p>
                    <p className="text-sm font-medium">{membership.email}</p>
                  </div>
                </div>
              </motion.div>
            </CardContent>
            <CardFooter>
              <Button onClick={onContinue} className="w-full rounded-full group">
                Continue to Abstract Submission
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

