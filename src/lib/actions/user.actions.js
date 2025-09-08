import { account, databases } from "../appwrite";
import { ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USER_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID;

export const signupUser = async (email, password, name, companyName) => {
  try {
    const newUserAcc = await account.create(ID.unique(), email, password, name);

    const newUser = await databases.createDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      ID.unique(),
      {
        name: newUserAcc.name,
        email: newUserAcc.email,
        companyName,
        role: "admin",
      }
    );

    return { success: true, newUser};
  } catch (error) {
    if (error.code === 409) {
      throw new Error("This email is already registered. Please log in.");
    }
    throw new Error(error.message || "Signup failed. Try again.");
  }
};

//login
export const loginUser = async (email, password) => {
  try {
    // check if already logged in
    const current = await account.get();
    if (current) {

    const result = await databases.listDocuments(
    DATABASE_ID,
    USER_COLLECTION_ID,
    [Query.equal("email", [current.email])]
  );
  return {...current,...result.documents[0]}
    }
  } catch (err) {
    // not logged in, so create one
    await account.createEmailPasswordSession(email, password);
  }

  const authUser = await account.get();

  const result = await databases.listDocuments(
    DATABASE_ID,
    USER_COLLECTION_ID,
    [Query.equal("email", [authUser.email])]
  );

  const userInfo = result.documents[0];
  return { ...authUser, ...userInfo };
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
  return {...current,...result.documents[0]}  
}  
else return
  } catch (error) {
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



