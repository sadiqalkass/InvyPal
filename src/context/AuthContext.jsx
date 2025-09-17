import { createContext, useContext, useEffect, useState } from "react";
import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  fetchCompanyUsers,
} from "../lib/actions/user.actions";
import { toast } from "react-toastify";
import { fetchCategories } from "../lib/actions/category.actions";
import { fetchStockItems } from "../lib/actions/stock.actions";
import { fetchCompanyDetails } from "../lib/actions/company.actions";
import { setupRealtimeListeners } from "../lib/realtime";
import { fetchTransactions } from "../lib/actions/transaction.actions";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);

  const [categories, setCategories] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [transactions, setTransactions] = useState([])
  const [companyPersonal, setCompanyPersonal] = useState([])

  useEffect(() => {
    // On reload, try to get current session
    checkUser();
  }, []);

  // Fetch data when user is available
useEffect(() => {
  if (!user) return;

  let unsubscribe; // capture outside so cleanup works

  const init = async () => {
    try {
      setLoading(true);

      // Fetch all data first
      await Promise.all([
        getStockItems(),
        getCategories(),
        getCompanyDets(),
        getTransactions(),
        getCompanyUsers()
      ]);

      // Setup realtime listeners
      unsubscribe = setupRealtimeListeners(
        user.companyId,
        setCategories,
        setStockItems,
        setTransactions
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  init();

  return () => {
    if (unsubscribe) unsubscribe(); // cleanup works correctly now
  };
}, [user]);


  // --- AUTH FUNCTIONS ---
  const signup = async (
    email,
    password,
    name,
    role,
    companyName = null,
    companyId = null
  ) => {
    let response;

    if (role === "admin") {
      // Use companyName, ignore companyId
      response = await signupUser(
        email,
        password,
        name,
        role,
        companyName,
        null
      );
    } else if (role === "staff") {
      // Use companyId, ignore companyName
      response = await signupUser(email, password, name, role, null, companyId);
    } else {
      throw new Error("Invalid role supplied");
    }

    setUser(response.newUser);
    localStorage.setItem("user", JSON.stringify(response.newUser));
    toast.success("Account created successfully!");
    return response.newUser;
  };

  const login = async (email, password) => {
    const loggedInUser = await loginUser(email, password);
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out");
  };

  // --- DATA FUNCTIONS ---
  const checkUser = async () => {
    try {
      setLoading(true);
      const authUser = await getCurrentUser();
      setUser(authUser);
      localStorage.setItem("user", JSON.stringify(authUser));
    } catch (err) {
      setUser(null); // no session
    } finally {
      setLoading(false);
    }
  };

  const getCompanyDets = async () => {
    try {
      const companyDets = await fetchCompanyDetails(user.companyId);
      setCompany(companyDets);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getCategories = async () => {
    try {
      const cate = await fetchCategories(user.companyId, user.$id);
      setCategories(cate);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getStockItems = async () => {
    try {
      const items = await fetchStockItems(user.companyId, user.$id);
      setStockItems(items);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getTransactions = async () => {
    try {
      const transactionsDets = await fetchTransactions(user.companyId)
      setTransactions(transactionsDets)
    } catch (error) {
        console.log(error);
      toast.error(error.message);
    }
  }

  const getCompanyUsers = async (params) => {
    try {
      const companyUsers = await fetchCompanyUsers(user.companyId)
      setCompanyPersonal(companyUsers)
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

   const getSeller = (userId) => {
    if (companyPersonal) {
      const seller = companyPersonal.filter(user => user.$id === userId)
      console.log(seller)
      return (`${seller[0].name} - ${seller[0].role}`)
    }else{
      return '.....'
    }
    }

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        categories,
        getCategories,
        stockItems,
        getStockItems,
        company,
        checkUser,
        getCompanyDets,
        transactions,
        companyPersonal,
        getSeller,
        getTransactions
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
