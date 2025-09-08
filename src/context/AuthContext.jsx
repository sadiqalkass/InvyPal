import { createContext, useContext, useEffect, useState } from "react";
import { signupUser, loginUser, logoutUser, getCurrentUser } from "../lib/actions/user.actions";
import { toast } from "react-toastify";
import { fetchCategories } from "../lib/actions/category.actions";
import { fetchStockItems } from "../lib/actions/stock.actions";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [stockItems, setStockItems] = useState([]);

  useEffect(() => {
    // On reload, try to get current session
    const checkUser = async () => {
      try {
        setLoading(true)
        const authUser =  await getCurrentUser() 
        setUser(authUser);
        localStorage.setItem("user", JSON.stringify(authUser));
      } catch (err) {
        setUser(null); // no session
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Fetch data when user is available
  useEffect(() => {
    if (user) {
      getCategories();
      getStockItems();
    }
  }, [user]);

  // --- AUTH FUNCTIONS ---
  const signup = async (email, password, name, companyName) => {
    const response = await signupUser(email, password, name, companyName);
    setUser(response.newUser)
    console.log(response.newUser)
    localStorage.setItem("user", JSON.stringify(response.newUser))
    toast.success("Account created successfully!");
    return newUser;
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
  const getCategories = async () => {
    try {
      const cate = await fetchCategories(user.$id);
      setCategories(cate);
      console.log(cate, 'categories bro')
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getStockItems = async () => {
    try {
      const items = await fetchStockItems(user.$id);
      setStockItems(items);
      console.log(items)
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, categories, getCategories, stockItems, getStockItems }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);