import { Client, Account, ID, Databases, Storage, Query } from "appwrite"

// Environment variables will be set by the user
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || ""
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ""
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || ""
const APPWRITE_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || ""
const APPWRITE_STORAGE_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID || ""
const APPWRITE_MEMBERSHIPS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_MEMBERSHIPS_COLLECTION_ID || ""

if (!APPWRITE_DATABASE_ID || !APPWRITE_COLLECTION_ID) {
  throw new Error("Appwrite Database ID or Collection ID is missing. Check environment variables.");
}
// Initialize the Appwrite client
const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID)

// Initialize Appwrite services
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

// Helper function to create a user session (if needed)
// export const createSession = async (email: string, password: string) => {
//   try {
//     return await account.createEmailSession(email, password)
//   } catch (error) {
//     console.error("Appwrite service :: createSession :: error", error)
//     throw error
//   }
// }

// Helper function to upload a file to Appwrite Storage
export const uploadFile = async (file: File) => {
  try {
    const response = await storage.createFile(APPWRITE_STORAGE_ID, ID.unique(), file)
    return response.$id
  } catch (error) {
    console.error("Appwrite service :: uploadFile :: error", error)
    throw error
  }
}

// Helper function to save form data to Appwrite Database
export const saveFormData = async (data: any) => {
  try {
    const response = await databases.createDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, ID.unique(), data)
    return response
  } catch (error) {
    console.error("Appwrite service :: saveFormData :: error", error)
    throw error
  }
}

export const verifyMembership = async (membershipId: string) => {
  try {
    const response = await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_MEMBERSHIPS_COLLECTION_ID, [
      Query.equal("membershipId", membershipId.toUpperCase()) // Adjust field name if necessary
    ])

    if (response.documents.length > 0) {
      return response.documents[0] // Return membership details
    }

    return null // Membership not found
  } catch (error) {
    console.error("Appwrite service :: verifyMembership :: error", error)
    throw error
  }
}