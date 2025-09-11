import { createContext, useContext, useEffect, useState } from "react";
import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../lib/actions/user.actions";
import { toast } from "react-toastify";
import { fetchCategories } from "../lib/actions/category.actions";
import { fetchStockItems } from "../lib/actions/stock.actions";
import { fetchCompanyDetails } from "../lib/actions/company.actions";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);

  const [categories, setCategories] = useState([]);
  const [stockItems, setStockItems] = useState([]);

  useEffect(() => {
    // On reload, try to get current session
    checkUser();
  }, []);

  // Fetch data when user is available
  useEffect(() => {
    if (user) {
      getCompanyDets();
    }
  }, [user]);

  //Fetch data when company is available
  useEffect(() => {
    if (company) {
      getCategories();
      getStockItems();
    }
  }, [company]);

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
      console.log(companyDets, "company");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getCategories = async () => {
    try {
      const cate = await fetchCategories(company.$id, user.$id);
      setCategories(cate);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getStockItems = async () => {
    try {
      const items = await fetchStockItems(company.$id, user.$id);
      setStockItems(items);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

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
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
