"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface FormProgressProps {
  currentStep: number
  steps: { title: string; component: React.ReactNode }[]
}

export default function FormProgress({ currentStep, steps }: FormProgressProps) {
  return (
    <div className="relative">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: index <= currentStep ? 1 : 0.8,
                opacity: index <= currentStep ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 z-10
                ${
                  index < currentStep
                    ? "bg-green-50 border-green-100"
                    : index === currentStep
                      ? "border-primary text-primary bg-white"
                      : "border-gray-300 text-gray-300 bg-white"
                }`}
            >
              {index < currentStep ? (
                <Check className="h-6 w-6 text-green-500" />
              ) : (
                <span className="text-lg">{index + 1}</span>
              )}
            </motion.div>
            <motion.span
              initial={{ opacity: 0.5 }}
              animate={{
                opacity: index <= currentStep ? 1 : 0.5,
                fontWeight: index <= currentStep ? 600 : 400,
              }}
              className={`mt-2 text-sm ${
                index < currentStep ? "text-green-600" : index === currentStep ? "text-primary" : "text-gray-500"
              }`}
            >
              {step.title}
            </motion.span>
          </div>
        ))}
      </div>

      {/* Progress line */}
      <div className="absolute top-6 left-0 right-0 h-0.5 -translate-y-1/2 bg-gray-200">
        <motion.div
          className="absolute h-full bg-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}

