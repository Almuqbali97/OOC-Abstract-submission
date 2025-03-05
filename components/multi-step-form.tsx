"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import PersonalInfoStep from "@/components/steps/personal-info-step"
import AuthorsStep from "@/components/steps/authors-step"
import AbstractDetailsStep from "@/components/steps/abstract-details-step"
import FormProgress from "@/components/form-progress"
import SuccessMessage from "@/components/success-message"
import { submitAbstract } from "@/app/actions"

// Define the form schema with Zod
const formSchema = z.object({
  // Personal Info
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(6, { message: "Please enter a valid phone number" }),

  // Authors
  authors: z
    .array(
      z.object({
        name: z.string().min(2, { message: "Author name must be at least 2 characters" }),
        email: z.string().email({ message: "Please enter a valid email address" }),
        affiliation: z.string().min(2, { message: "Affiliation must be at least 2 characters" }),
        cv: z.instanceof(File, { message: "Please upload a CV" }).optional(),
      }),
    )
    .min(1, { message: "At least one author is required" }),

  // Abstract Details
  abstractTitle: z.string().min(5, { message: "Abstract title must be at least 5 characters" }),
  topic: z.string({ required_error: "Please select a topic" }),
  presentationType: z.string({ required_error: "Please select a presentation type" }),
  researchType: z.string().optional(),
  abstractText: z.string().max(3000, { message: "Abstract text must not exceed 3000 characters" }).optional(),
  file: z.instanceof(File, { message: "Please upload a file" }),
})

type FormValues = z.infer<typeof formSchema>

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      authors: [{ name: "", email: "", affiliation: "" }],
      abstractTitle: "",
      topic: "",
      presentationType: "",
      researchType: "",
      abstractText: "",
      file: undefined,
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  })

  const steps = [
    { title: "Personal Information", component: <PersonalInfoStep /> },
    { title: "Author Details", component: <AuthorsStep /> },
    { title: "Abstract Details", component: <AbstractDetailsStep /> },
  ]

  const goToNextStep = async () => {
    const fieldsToValidate =
      currentStep === 0
        ? ["firstName", "lastName", "email", "phone"]
        : currentStep === 1
          ? ["authors"]
          : ["abstractTitle", "topic", "presentationType", "file"]

    // Set all fields as touched before validation
    fieldsToValidate.forEach((field) => {
      methods.trigger(field as any)
    })

    const isStepValid = await methods.trigger(fieldsToValidate as any)

    if (isStepValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1)
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      // Create FormData object to handle file uploads
      const formData = new FormData()

      // Add basic fields
      formData.append("firstName", data.firstName)
      formData.append("lastName", data.lastName)
      formData.append("email", data.email)
      formData.append("phone", data.phone)
      formData.append("abstractTitle", data.abstractTitle)
      formData.append("topic", data.topic)
      formData.append("presentationType", data.presentationType)

      // Add optional fields
      if (data.researchType) {
        formData.append("researchType", data.researchType)
      }

      if (data.abstractText) {
        formData.append("abstractText", data.abstractText)
      }

      // Add file
      if (data.file) {
        formData.append("file", data.file)
      }

      // Process authors data - convert to JSON string to pass through FormData
      const authorsData = data.authors.map((author) => {
        // Create a serializable version of the author data
        const serializedAuthor = {
          name: author.name,
          email: author.email,
          affiliation: author.affiliation,
          // We'll handle the CV files separately
          hasCv: !!author.cv,
        }

        // If there's a CV file, add it to formData with a unique key
        if (author.cv) {
          formData.append(`authorCv_${author.email}`, author.cv)
        }

        return serializedAuthor
      })

      formData.append("authors", JSON.stringify(authorsData))

      // Submit the form using the server action
      const result = await submitAbstract(formData)

      if (result.success) {
        setSubmissionId(result.submissionId)
        setIsSubmitted(true)
      } else {
        setSubmissionError(result.error || "An unknown error occurred. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmissionError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return <SuccessMessage submissionId={submissionId} />
  }

  return (
    <div className="max-w-3xl mx-auto">
      <FormProgress currentStep={currentStep} steps={steps} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="mt-6 gradient-border">
          <CardContent className="pt-6">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {steps[currentStep].component}
                  </motion.div>
                </AnimatePresence>

                {submissionError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                    {submissionError}
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                    disabled={currentStep === 0}
                    className="rounded-full px-6"
                  >
                    Previous
                  </Button>

                  {currentStep === steps.length - 1 ? (
                    <Button type="submit" className="rounded-full px-8" disabled={isSubmitting}>
                      {isSubmitting ? (
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
                          Submitting...
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  ) : (
                    <Button type="button" onClick={goToNextStep} className="rounded-full px-8">
                      Next
                    </Button>
                  )}
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

