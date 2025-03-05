import { Client, Account, ID, Databases, Storage, Permission, Role } from "appwrite"
// this component need to be fixed to accept uploading files
// Environment variables will be set by the user
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || ""
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ""
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || ""
const APPWRITE_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || ""
const APPWRITE_STORAGE_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID || ""

console.log("Appwrite Config:");
console.log("ENDPOINT:", APPWRITE_ENDPOINT);
console.log("PROJECT_ID:", APPWRITE_PROJECT_ID);
console.log("DATABASE_ID:", APPWRITE_DATABASE_ID);
console.log("COLLECTION_ID:", APPWRITE_COLLECTION_ID);
console.log("STORAGE_ID:", APPWRITE_STORAGE_ID);

// Initialize the Appwrite client
const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID)

// Initialize Appwrite services
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

// Helper function to create a user session (if needed)
export const createSession = async (email: string, password: string) => {
  try {
    return await account.createEmailSession(email, password)
  } catch (error) {
    console.error("Appwrite service :: createSession :: error", error)
    throw error
  }
}

export const checkUser = async () => {
  try {
    const user = await account.get();
    console.log("✅ Authenticated User:", user);
    return user;
  } catch (error) {
    console.error("❌ User is not authenticated:", error);
    throw error;
  }
};



// Helper function to upload a file to Appwrite Storage
export const uploadFile = async (file: File) => {

  try {
    const response = await storage.createFile(APPWRITE_STORAGE_ID,
      ID.unique(),
      file,
      [
        // Permission.read(Role.user("current")),  // The logged-in user can read
        // Permission.write(Role.user("current")),  // The logged-in user can update
        // // Permission.create(Role.user("current"))  // The logged-in user can update
        Permission.write(Role.any()),
      ]
    )
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

