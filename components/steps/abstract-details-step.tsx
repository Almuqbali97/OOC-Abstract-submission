"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Upload, FileIcon, X, Film } from "lucide-react"

export default function AbstractDetailsStep() {
  const { control, setValue, watch, trigger } = useFormContext()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [touched, setTouched] = useState(false)

  const presentationType = useWatch({
    control,
    name: "presentationType",
  })

  const abstractText = watch("abstractText") || ""

  useEffect(() => {
    setCharCount(abstractText.length)
  }, [abstractText])

  const file = watch("file")

  // Determine accepted file types based on presentation type
  const getAcceptedFileTypes = () => {
    if (presentationType === "3") {
      // Video Presentation
      return ".mp4,.mov,.avi,.wmv"
    }
    return ".pdf,.doc,.docx" // Default for other presentation types
  }

  // Get file type description based on presentation type
  const getFileTypeDescription = () => {
    if (presentationType === "3") {
      // Video Presentation
      return "Supports MP4, MOV, AVI, WMV (Max 100MB)"
    }
    return "Supports PDF, DOC, DOCX (Max 10MB)"
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setValue("file", e.dataTransfer.files[0], { shouldValidate: true })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      setValue("file", e.target.files[0], { shouldValidate: true })
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = () => {
    setValue("file", undefined, { shouldValidate: true })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const showResearchTypeOptions = presentationType === "1" || presentationType === "2"

  // Handle field touch
  const handleFieldTouch = () => {
    if (!touched) {
      setTouched(true)
      // Trigger validation for all fields in this step
      trigger(["abstractTitle", "topic", "presentationType", "file"])
      if (showResearchTypeOptions) {
        trigger(["researchType", "abstractText"])
      }
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Abstract Details</h2>
      <p className="text-muted-foreground">Provide details about your abstract submission.</p>

      <FormField
        control={control}
        name="abstractTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Abstract Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter the title of your abstract"
                {...field}
                onBlur={() => {
                  field.onBlur()
                  handleFieldTouch()
                }}
              />
            </FormControl>
            {(touched || field.value) && <FormMessage />}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="topic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Topic</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value)
                handleFieldTouch()
              }}
              defaultValue={field.value}
              onOpenChange={() => handleFieldTouch()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Myopia</SelectItem>
                <SelectItem value="2">Dry Eye</SelectItem>
                <SelectItem value="3">Content Lens</SelectItem>
                <SelectItem value="4">Pediatric Optometry</SelectItem>
                <SelectItem value="5">Ophthalmic Multimodal Imaging</SelectItem>
                <SelectItem value="6">Low vision</SelectItem>
                <SelectItem value="7">Others</SelectItem>
              </SelectContent>
            </Select>
            {(touched || field.value) && <FormMessage />}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="presentationType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Presentation Type</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value)
                handleFieldTouch()
                // Reset file when changing presentation type
                setValue("file", undefined)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ""
                }
              }}
              defaultValue={field.value}
              onOpenChange={() => handleFieldTouch()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select presentation type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Oral presentation</SelectItem>
                <SelectItem value="2">Poster</SelectItem>
                <SelectItem value="3">Video Presentation</SelectItem>
              </SelectContent>
            </Select>
            {(touched || field.value) && <FormMessage />}
          </FormItem>
        )}
      />

      {showResearchTypeOptions && (
        <FormField
          control={control}
          name="researchType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Research Type</FormLabel>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="original-research"
                    checked={field.value === "original"}
                    onCheckedChange={() => {
                      setValue("researchType", "original")
                      handleFieldTouch()
                    }}
                  />
                  <label
                    htmlFor="original-research"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Original research
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="case-presentation"
                    checked={field.value === "case"}
                    onCheckedChange={() => {
                      setValue("researchType", "case")
                      handleFieldTouch()
                    }}
                  />
                  <label
                    htmlFor="case-presentation"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Case presentation
                  </label>
                </div>
              </div>
              {touched && <FormMessage />}
            </FormItem>
          )}
        />
      )}

      {showResearchTypeOptions && (
        <FormField
          control={control}
          name="abstractText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abstract Text</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your abstract text here"
                  className="min-h-[200px]"
                  maxLength={3000}
                  {...field}
                  onBlur={() => {
                    field.onBlur()
                    handleFieldTouch()
                  }}
                />
              </FormControl>
              <FormDescription className="flex justify-end">{charCount}/3000 characters</FormDescription>
              {(touched || field.value) && <FormMessage />}
            </FormItem>
          )}
        />
      )}

      {presentationType && (
        <FormField
          control={control}
          name="file"
          render={({ field: { value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Upload Abstract File</FormLabel>
              <FormControl>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    dragActive ? "border-primary bg-primary/5" : "border-gray-300"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => handleFieldTouch()}
                >
                  <input
                    {...fieldProps}
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      handleChange(e)
                      handleFieldTouch()
                    }}
                    accept={getAcceptedFileTypes()}
                  />

                  {file ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        {presentationType === "3" ? (
                          <Film className="h-8 w-8 text-primary" />
                        ) : (
                          <FileIcon className="h-8 w-8 text-primary" />
                        )}
                      </div>
                      <p className="text-sm font-medium mb-1">{file.name}</p>
                      <p className="text-xs text-muted-foreground mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeFile}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        {presentationType === "3" ? (
                          <Film className="h-8 w-8 text-primary" />
                        ) : (
                          <Upload className="h-8 w-8 text-primary" />
                        )}
                      </div>
                      <p className="text-sm font-medium mb-1">Drag and drop your file here or click to browse</p>
                      <p className="text-xs text-muted-foreground mb-4">{getFileTypeDescription()}</p>
                      <Button type="button" variant="outline" onClick={handleButtonClick}>
                        Select File
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              {(touched || value) && <FormMessage />}
            </FormItem>
          )}
        />
      )}
    </div>
  )
}

