"use client"

import type React from "react"

import { useRef } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { PlusCircle, Trash2, Upload, File, X } from "lucide-react"

export default function AuthorsStep() {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "authors",
  })

  const fileInputRefs = useRef<HTMLInputElement[]>([])

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Author Details</h2>
      <p className="text-muted-foreground">Add information about the author(s).</p>

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Author {index + 1}</h3>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-destructive hover:text-destructive/90"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            )}
          </div>

          <FormField
            control={control}
            name={`authors.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Author Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`authors.${index}.email`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="author@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`authors.${index}.affiliation`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Affiliation</FormLabel>
                <FormControl>
                  <Input placeholder="University or Organization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`authors.${index}.cv`}
            render={({ field }) => {
              const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                  setValue(`authors.${index}.cv`, e.target.files[0], { shouldValidate: true })
                }
              }

              const handleButtonClick = () => {
                fileInputRefs.current[index]?.click()
              }

              const removeFile = () => {
                setValue(`authors.${index}.cv`, undefined, { shouldValidate: true })
                if (fileInputRefs.current[index]) {
                  fileInputRefs.current[index].value = ""
                }
              }

              return (
                <FormItem>
                  <FormLabel>CV / Resume</FormLabel>
                  <FormControl>
                    <div className="border rounded-lg p-4">
                      <input
                        type="file"
                        className="hidden"
                        ref={(el) => (fileInputRefs.current[index] = el)}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                      />

                      {field.value ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <File className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm font-medium">{field.value.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeFile}
                            className="text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button type="button" variant="outline" onClick={handleButtonClick} className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload CV
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ name: "", email: "", affiliation: "" })}
        className="w-full"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Another Author
      </Button>

      {errors.authors && typeof errors.authors.message === "string" && (
        <p className="text-sm font-medium text-destructive">{errors.authors.message}</p>
      )}
    </div>
  )
}

