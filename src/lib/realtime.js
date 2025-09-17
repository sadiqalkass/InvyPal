import { client } from "./appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const CATEGORY_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CATEGORY_COLLECTION_ID;
const STOCK_COLLECTION_ID = import.meta.env.VITE_APPWRITE_STOCK_COLLECTION_ID;
const TRANSACTION_COLLECTION_ID = import.meta.env.VITE_APPWRITE_TRANSACTION_COLLECTION_ID;

export const setupRealtimeListeners = (companyId, setCategories, setStockItems, setTransactions) => {
  // Categories
  const categoriesSub = client.subscribe(
    `databases.${DATABASE_ID}.collections.${CATEGORY_COLLECTION_ID}.documents`,
    (response) => {
      const event = response.events[0];
      const payload = response.payload;

      if (event.includes("create")) {
        setCategories((prev) => [...prev, payload]);
      }
      if (event.includes("update")) {
        setCategories((prev) =>
          prev.map((cat) => (cat.$id === payload.$id ? payload : cat))
        );
      }
      if (event.includes("delete")) {
        setCategories((prev) => prev.filter((cat) => cat.$id !== payload.$id));
      }
    }
  );

  // Stock Items
  const stockSub = client.subscribe(
    `databases.${DATABASE_ID}.collections.${STOCK_COLLECTION_ID}.documents`,
    (response) => {
      const event = response.events[0];
      const payload = response.payload;

      if (event.includes("create")) {
        setStockItems((prev) => [...prev, payload]);
      }
      if (event.includes("update")) {
        setStockItems((prev) =>
          prev.map((item) => (item.$id === payload.$id ? payload : item))
        );
      }
      if (event.includes("delete")) {
        setStockItems((prev) => prev.filter((item) => item.$id !== payload.$id));
      }
    }
  );

  // Transactions
  const txSub = client.subscribe(
    `databases.${DATABASE_ID}.collections.${TRANSACTION_COLLECTION_ID}.documents`,
    (response) => {
      const event = response.events[0];
      const payload = response.payload;

      if (event.includes("create")) {
        setTransactions((prev) => [payload, ...prev]); // prepend new transaction
      }
      if (event.includes("update")) {
        setTransactions((prev) =>
          prev.map((tx) => (tx.$id === payload.$id ? payload : tx))
        );
      }
      if (event.includes("delete")) {
        setTransactions((prev) => prev.filter((tx) => tx.$id !== payload.$id));
      }
    }
  );

  // Cleanup
  return () => {
    categoriesSub();
    stockSub();
    txSub();
  };
};
