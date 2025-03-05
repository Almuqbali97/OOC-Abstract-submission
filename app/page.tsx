"use client"

import { useState, useEffect } from "react"
import LoadingScreen from "@/components/loading-screen"
import MultiStepForm from "@/components/multi-step-form"
import MembershipVerification from "@/components/membership-verification"

type AppView = "loading" | "membership" | "form"

export default function Home() {
  const [view, setView] = useState<AppView>("loading")
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    // Set animation complete after 2 seconds
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="container mx-auto py-10 px-4 min-h-screen">
      {view === "loading" && (
        <LoadingScreen animationComplete={animationComplete} onStartSubmission={() => setView("membership")} />
      )}

      {view === "membership" && <MembershipVerification onContinue={() => setView("form")} />}

      {view === "form" && (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">Abstract Submission</h1>
          <MultiStepForm />
        </>
      )}
    </main>
  )
}

