import sgMail from "@sendgrid/mail"

// The API key will be set by the user
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ""
const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@omanoptometryclub.com"

// Initialize SendGrid
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

interface EmailData {
  firstName: string
  lastName: string
  email: string
  abstractTitle: string
  submissionId: string
}

export const sendConfirmationEmail = async (data: EmailData) => {
  if (!SENDGRID_API_KEY) {
    console.warn("SendGrid API key not set. Email not sent.")
    return
  }

  const msg = {
    to: data.email,
    from: `OOC2025 <${SENDER_EMAIL}>`,
    subject: "Abstract Submission Confirmation - Oman Optometry Club",
    text: `Dear ${data.firstName} ${data.lastName},\n\nThank you for submitting your abstract "${data.abstractTitle}" to the Oman Optometry Club. Your submission has been received successfully.\n\nSubmission ID: ${data.submissionId}\n\nWe will review your submission and get back to you soon.\n\nBest regards,\nOman Optometry Club Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-RJyHDQFySIp9rjFqoWv1rxXZPRMHh0.png" alt="OOC Logo" style="width: 80px; height: auto;">
          <h1 style="color: #623CEA; margin-top: 10px;">Abstract Submission Confirmation</h1>
        </div>
        
        <p>Dear ${data.firstName} ${data.lastName},</p>
        
        <p>Thank you for submitting your abstract <strong>"${data.abstractTitle}"</strong> to the Oman Optometry Club. Your submission has been received successfully.</p>
        
        <div style="background-color: #f5f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Submission ID:</strong> ${data.submissionId}</p>
        </div>
        
        <p>We will review your submission and get back to you soon.</p>
        
        <p>Best regards,<br>Oman Optometry Club Team</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    `,
  }

  try {
    await sgMail.send(msg)
    console.log("Confirmation email sent successfully")
    return true
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    throw error
  }
}

export const sendAdminNotificationEmail = async (data: EmailData) => {
  if (!SENDGRID_API_KEY) {
    console.warn("SendGrid API key not set. Admin notification email not sent.")
    return
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@omanoptometryclub.com"

  const msg = {
    to: adminEmail,
    from: `OOC2025 <${SENDER_EMAIL}>`,
    subject: "New Abstract Submission - Oman Optometry Club",
    text: `A new abstract has been submitted.\n\nSubmission ID: ${data.submissionId}\nTitle: ${data.abstractTitle}\nSubmitter: ${data.firstName} ${data.lastName} (${data.email})\n\nPlease log in to the admin panel to review this submission.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-RJyHDQFySIp9rjFqoWv1rxXZPRMHh0.png" alt="OOC Logo" style="width: 80px; height: auto;">
          <h1 style="color: #623CEA; margin-top: 10px;">New Abstract Submission</h1>
        </div>
        
        <p>A new abstract has been submitted to the Oman Optometry Club.</p>
        
        <div style="background-color: #f5f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Submission ID:</strong> ${data.submissionId}</p>
          <p><strong>Title:</strong> ${data.abstractTitle}</p>
          <p><strong>Submitter:</strong> ${data.firstName} ${data.lastName} (${data.email})</p>
        </div>
        
        <p>Please log in to the admin panel to review this submission.</p>
      </div>
    `,
  }

  try {
    await sgMail.send(msg)
    console.log("Admin notification email sent successfully")
    return true
  } catch (error) {
    console.error("Error sending admin notification email:", error)
    throw error
  }
}

