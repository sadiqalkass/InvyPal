import { ID, Query } from "appwrite";
import { databases } from "../appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const CATEGORY_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CATEGORY_COLLECTION_ID;
const STOCK_COLLECTION_ID = import.meta.env.VITE_APPWRITE_STOCK_COLLECTION_ID;

export const createCategory = async (name, description, userId, companyId) => {
  try {
    const newCategory = await databases.createDocument(
      DATABASE_ID,
      CATEGORY_COLLECTION_ID,
      ID.unique(),
      {
        name,
        description,
        userId,
        companyId
      }
    );
    if (newCategory) {
      return { success: true, message: "Category created successfully" };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Creating category failed. Try again.");
  }
};

export const fetchCategoryById = async (categoryId) => {
  try {
    const category = await databases.getDocument(
      DATABASE_ID,
      CATEGORY_COLLECTION_ID,
      categoryId
    );
    return category;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Fetching category failed. Try again.");
  }
};


export const fetchCategories = async (companyId, userId) => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      CATEGORY_COLLECTION_ID,
      [Query.equal("companyId", [companyId])]
    );

    if (!result.documents || result.documents.length === 0) {
      // create a default category if user has none
      const defaultCategory = await databases.createDocument(
        DATABASE_ID,
        CATEGORY_COLLECTION_ID,
        ID.unique(),
        {
          name: "General",
          description: "Default category",
          userId,
          companyId
        }
      );

      return [defaultCategory]; // return as array so UI works the same
    }

    return result.documents;
  } catch (error) {
    console.error("fetchCategories error:", error);
    throw new Error(error.message || "Fetching categories failed. Try again.");
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    // fetch items belonging to this category
    const items = await databases.listDocuments(
      DATABASE_ID,
      STOCK_COLLECTION_ID,
      [Query.equal("categoryId", [categoryId])]
    );

    // delete all items in category
    for (const item of items.documents) {
      await databases.deleteDocument(
        DATABASE_ID,
        STOCK_COLLECTION_ID,
        item.$id
      );
    }

    // delete the category itself
    await databases.deleteDocument(
      DATABASE_ID,
      CATEGORY_COLLECTION_ID,
      categoryId
    );

    return {
      success: true,
      message: "Category and its items deleted successfully",
    };
  } catch (error) {
    console.error("Delete category error:", error);
    throw new Error(error.message || "Deleting category failed. Try again.");
  }
};

export const updateCategory = async (categoryId, name, description) => {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      CATEGORY_COLLECTION_ID,
      categoryId,
      {
        name,
        description,
      }
    );
    return { success: true, message: "Category updated successfully" };
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Updating category failed. Try again.");
  }
};
