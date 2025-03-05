"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FileText, FileIcon as FilePresentation, ArrowRight } from "lucide-react"
import Image from "next/image"

interface LoadingScreenProps {
  animationComplete: boolean
  onStartSubmission: () => void
}

export default function LoadingScreen({ animationComplete, onStartSubmission }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <div className="flex justify-center mb-8">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100"
            />
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-RJyHDQFySIp9rjFqoWv1rxXZPRMHh0.png"
              alt="OOC Logo"
              width={120}
              height={120}
              className="relative z-10"
              priority
            />
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                repeatType: "reverse",
              }}
              className="absolute inset-0 rounded-full border-4 border-primary/30"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0.3 }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 3,
                repeatType: "reverse",
              }}
              className="absolute inset-0 rounded-full border-2 border-primary/20"
            />
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-2 gradient-text"
        >
          Oman Optometry Club
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-xl md:text-2xl text-muted-foreground mb-10"
        >
          Abstract Submission
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          <Button
            variant="outline"
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10 hover:scale-105 transition-transform duration-300"
            onClick={() => window.open("/occ-templates.zip", "_blank")}
          >
            <FilePresentation className="h-5 w-5" />
            Download PPT Template
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10 hover:scale-105 transition-transform duration-300"
            onClick={() => window.open("/abstract-submission-guidelines.pdf", "_blank")}
          >
            <FileText className="h-5 w-5" />
            Download Guidelines
          </Button>
        </motion.div>

        {animationComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <Button size="lg" onClick={onStartSubmission} className="px-8 py-7 text-lg group rounded-full">
              Submit Abstract
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

