import { ID, Query } from "appwrite";
import { databases } from "../appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const STOCK_COLLECTION_ID = import.meta.env.VITE_APPWRITE_STOCK_COLLECTION_ID;
const TRANSACTION_COLLECTION_ID = import.meta.env.VITE_APPWRITE_TRANSACTION_COLLECTION_ID;

// Add Transaction
export const addTransaction = async (itemId, quantitySold, userId, companyId) => {
  try {
    // 1. Fetch stock item
    const stockItem = await databases.getDocument(DATABASE_ID, STOCK_COLLECTION_ID, itemId);

  if (!stockItem) {
      throw new Error("Stock item not found.");
    }
    
    if (stockItem.quantity < quantitySold) {
      throw new Error("Not enough stock available.");
    }

     // 2. Create a transaction record
    const transaction = await databases.createDocument(
      DATABASE_ID,
      TRANSACTION_COLLECTION_ID,
      ID.unique(),
      {
        itemId,
        itemName: stockItem.name,
        amount: parseFloat(stockItem.price * quantitySold),
        quantity: parseInt(quantitySold),
        userId,
        companyId
      }
    );

    // 3. Update stock quantity
    await databases.updateDocument(
      DATABASE_ID,
      STOCK_COLLECTION_ID,
      itemId,
      { quantity: stockItem.quantity - quantitySold }
    );

    return { success: true, message: 'Item sold successfully', transaction };
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Transaction failed");
  }
};

// ✅ Fetch all transactions for a company
export const fetchTransactions = async (companyId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      TRANSACTION_COLLECTION_ID,
      [Query.equal("companyId", companyId), Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch transactions");
  }
};
