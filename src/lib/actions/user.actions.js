import { account, databases, storage } from "../appwrite";
import { ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USER_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
const COMPANY_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COMPANY_COLLECTION_ID


export const signupUser = async (email, password, name, role, companyName, companyId) => {
  try {
    // Step 1: Create Appwrite account
    const newUserAcc = await account.create(ID.unique(), email, password, name);

      // ✅ Create session immediately after signup
    await account.createEmailPasswordSession(email, password);

    let finalCompanyId;

    if (role === "admin") {
      // Admin must provide a companyName
      if (!companyName) {
        throw new Error("Company name is required for admin signup.");
      }

      // Create company
      const newCompany = await databases.createDocument(
        DATABASE_ID,
        COMPANY_COLLECTION_ID,
        ID.unique(),
        {
          name: companyName,
          ownerId: newUserAcc.$id,
        }
      );

      // Store the companyId from the company doc
      finalCompanyId = newCompany.$id;

    } else if (role === "staff") {
      // Staff must provide a valid companyId
      if (!companyId) {
        throw new Error("Company ID is required for staff signup.");
      }

      // 1. Check if company exists
      let company;
      try {
        company = await databases.getDocument(
          DATABASE_ID,
          COMPANY_COLLECTION_ID,
          companyId
        );
      } catch (err) {
        throw new Error("Invalid company ID. Please contact your admin.");
      }

      // 2. Ensure no staff already exists for this company
      const existingStaff = await databases.listDocuments(
        DATABASE_ID,
        USER_COLLECTION_ID,
        [
          Query.equal("role", "staff"),
          Query.equal("companyId", companyId),
        ]
      );

      if (existingStaff.documents.length > 0) {
        throw new Error("A staff member already exists for this company.");
      }

      finalCompanyId = company.$id;
    } else {
      throw new Error("Invalid role. Must be 'admin' or 'staff'.");
    }

    // Step 2: Create user record in Users collection
    const newUser = await databases.createDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      ID.unique(),
      {
        name: newUserAcc.name,
        email: newUserAcc.email,
        role,
        companyId: finalCompanyId, // ✅ both admin & staff will share the same companyId
      }
    );

    return { success: true, newUser };

  } catch (error) {
    if (error?.code === 409) {
      throw new Error("This email is already registered. Please log in.");
    }
    throw new Error(error.message || "Signup failed. Try again.");
  }
};

//login
export const loginUser = async (email, password) => {
  try {
    const current = account.get()
    if (current) {
      account.deleteSession()
    }
    // check if already logged in
    await account.createEmailPasswordSession(email, password)

  const authUser = await account.get();

  const result = await databases.listDocuments(
    DATABASE_ID,
    USER_COLLECTION_ID,
    [Query.equal("email", [authUser.email])]
  );

  const userInfo = result.documents[0];
  return { ...authUser, ...userInfo };
}catch(error){
  console.log(error)
  throw new Error(error.message);
}
};


export const getCurrentUser = async() => {
  try {
    const current = await account.get();
    if (current) {
    const result = await databases.listDocuments(
    DATABASE_ID,
    USER_COLLECTION_ID,
    [Query.equal("email", [current.email])]
  );
  return {...result.documents[0]}  
}  
else return
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch user, Reload/Login again');
  }
}

export const fetchCompanyUsers = async (companyId) => {
  try{
    const companyUsers = await databases.listDocuments(
      DATABASE_ID,
      USER_COLLECTION_ID,
      [Query.equal('companyId', [companyId])]
    )
    return companyUsers.documents
  }catch(error){
     console.log(error)
    throw new Error(error.message);
  }
}

// Logout
export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (err) {
    console.error("Error during logout:", err);
  }
};

export const updateUserInfo = async (userId, name) => {
  try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        USER_COLLECTION_ID,
        userId,
        {
          name}
      )
      if(response) return {success: true, message: "Personal Info updated successfully"}
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Updating user info failed. Try again.");
  }
}

