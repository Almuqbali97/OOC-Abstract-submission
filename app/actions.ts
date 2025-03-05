"use server"

import { uploadFile, saveFormData } from "@/lib/appwrite"
import { sendConfirmationEmail, sendAdminNotificationEmail } from "@/lib/sendgrid"

export async function submitAbstract(formData: FormData) {
  try {
    // Extract file from formData
    const abstractFile = formData.get("file") as File
    let fileId = null

    // Upload file to Appwrite Storage
    // if (abstractFile) {
    //   fileId = await uploadFile(abstractFile)
    // }

    // Process author CVs if present
    const authors = JSON.parse(formData.get("authors") as string)
    const processedAuthors = await Promise.all(
      authors.map(async (author: any) => {
        if (author.cv) {
          const cvFileId = await uploadFile(author.cv)
          return { ...author, cvFileId }
        }
        return author
      }),
    )

    // Prepare data for database
    const submissionData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      authors: processedAuthors,
      abstractTitle: formData.get("abstractTitle"),
      topic: formData.get("topic"),
      presentationType: formData.get("presentationType"),
      researchType: formData.get("researchType") || null,
      abstractText: formData.get("abstractText") || null,
      fileId,
      submittedAt: new Date().toISOString(),
    }

    // Save to Appwrite Database
    // const response = await saveFormData(submissionData)
    // const submissionId = response.$id

    // Send confirmation email to user
    await sendConfirmationEmail({
      firstName: submissionData.firstName as string,
      lastName: submissionData.lastName as string,
      email: submissionData.email as string,
      abstractTitle: submissionData.abstractTitle as string,
      // submissionId,
    })

    // Send notification email to admin
    // await sendAdminNotificationEmail({
    //   firstName: submissionData.firstName as string,
    //   lastName: submissionData.lastName as string,
    //   email: submissionData.email as string,
    //   abstractTitle: submissionData.abstractTitle as string,
    //   submissionId,
    // })

    return {
      success: true,
      // submissionId
    }
  } catch (error) {
    console.error("Error submitting abstract:", error)
    return { success: false, error: "Failed to submit abstract. Please try again." }
  }
}

