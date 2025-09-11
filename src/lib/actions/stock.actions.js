import { ID, Query } from "appwrite";
import { databases, storage } from "../appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const STOCK_COLLECTION_ID = import.meta.env.VITE_APPWRITE_STOCK_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export const addToStock = async (
  imgFile,
  name,
  categoryId,
  quantity,
  price,
  userId,
  companyId
) => {
  try {
    const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), imgFile);
    const imgUrl = uploaded.$id;
    if (!imgUrl) throw new Error("Image not uploaded. Please try again");

    const newProduct = await databases.createDocument(
      DATABASE_ID,
      STOCK_COLLECTION_ID,
      ID.unique(),
      {
        name,
        quantity: parseInt(quantity), // 👈 force string -> integer
        price: parseFloat(price),
        categoryId,
        imgUrl,
        userId,
        companyId
      }
    );

    if (newProduct) {
      return { success: true, message: "Item added successfully" };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Adding item to Stock failed. Try again.");
  }
};

export const fetchStockItems = async (companyId) => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      STOCK_COLLECTION_ID,
      [Query.equal("companyId", [companyId])] // wrap in an array
    );

    const documents = result.documents.map((doc) => ({
      ...doc,
      imgUrl: storage.getFileView(BUCKET_ID, doc.imgUrl),
      imgId: doc.imgUrl,
    }));

    return documents;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Fetching stock items failed. Try again.");
  }
};

export const fetchStockItemById = async (itemId) => {
  try {
    const result = await databases.getDocument(
      DATABASE_ID,
      STOCK_COLLECTION_ID,
      itemId
    );
    const imgUrl = storage.getFileView(BUCKET_ID, result.imgUrl);
    const doc = { ...result, imgUrl, imgId: result.imgUrl };
    return doc;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Fetching stock item failed. Try again.");
  }
};
export const deleteStockItem = async (itemId, imgId) => {
  try {
    await storage.deleteFile(BUCKET_ID, imgId);

    await databases.deleteDocument(DATABASE_ID, STOCK_COLLECTION_ID, itemId);

    return { success: true, message: "Item deleted successfully" };
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Deleting item failed. Try again.");
  }
};
export const updateStockItem = async (
  itemId,
  imgFile,
  name,
  categoryId,
  quantity,
  price,
  oldImgId
) => {
  try {
    let imgUrl = oldImgId;
    if (imgFile) {
      const uploaded = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        imgFile
      );
      imgUrl = uploaded.$id;
      if (!imgUrl) throw new Error("Image not uploaded. Please try again");
      await storage.deleteFile(BUCKET_ID, oldImgId);
    }
    await databases.updateDocument(DATABASE_ID, STOCK_COLLECTION_ID, itemId, {
      name,
      quantity: parseInt(quantity), // 👈 force string -> integer
      price: parseFloat(price),
      categoryId,
      imgUrl,
    });
    return { success: true, message: "Item updated successfully" };
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Updating item failed. Try again.");
  }
};
