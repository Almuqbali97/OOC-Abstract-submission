"use client"

import { motion } from "framer-motion"
import { CheckCircle, ArrowRight, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

interface SuccessMessageProps {
  submissionId?: string | null
}

export default function SuccessMessage({ submissionId }: SuccessMessageProps) {
  const [copied, setCopied] = useState(false)

  const copySubmissionId = () => {
    if (submissionId) {
      navigator.clipboard.writeText(submissionId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className="max-w-md mx-auto mt-10 gradient-border">
        <CardContent className="pt-6 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.2,
            }}
            className="flex justify-center mb-6 mt-4"
          >
            <div className="rounded-full bg-gradient-to-r from-green-100 to-green-200 p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold mb-2 gradient-text"
          >
            Abstract Submitted Successfully!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground mb-4"
          >
            Thank you for your submission. Your abstract has been received and will be reviewed by the Oman Optometry
            Club committee.
          </motion.p>

          {submissionId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-primary/5 p-4 rounded-lg mb-6"
            >
              <p className="text-sm text-muted-foreground mb-2">Submission ID:</p>
              <div className="flex items-center justify-center">
                <p className="font-mono font-medium text-primary">{submissionId}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-8 w-8 p-0"
                  onClick={copySubmissionId}
                  title="Copy submission ID"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
              {copied && <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>}
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Button onClick={() => window.location.reload()} className="rounded-full px-8 py-6 group">
              Submit Another Abstract
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

