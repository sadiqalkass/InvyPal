import { ToastContainer } from "react-toastify";
import "./App.css";
import Login from "./pages/Login";
import { createBrowserRouter, Route, RouterProvider } from "react-router";
import { createRoutesFromElements } from "react-router";
import Home from './pages/Home'
import Layout from "./layout/layout";
import { useAuth } from "./context/AuthContext";
import AddCategory from "./pages/AddCategory";
import AddStock from "./pages/AddStock";
import Stock from "./pages/Stock";
import CategoryLayout from "./layout/CategoryLayout";
import CategoryList from "./pages/CategoryList";
import LoadingScreen from "./components/LoadingScreen";
import UpcomingFeatures from "./components/UpcomingFeatures";
import EditCategory from "./pages/EditCategory";
import EditStockItem from "./pages/EditStockItem";
import ProfilePage from "./pages/Profile";

function App() {
  const {loading, user} = useAuth()
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="category" element={<CategoryLayout/>}>
            <Route index element={<AddCategory/>}/>
            <Route path="list" element={<CategoryList/>}/>
            <Route path=":id" element={<EditCategory/>}/>
          </Route>
          <Route path="add-stock" element={<AddStock/>}/>
          <Route path="stock" element={<Stock/>}/>
          <Route path="stock/:id" element={<EditStockItem/>}/>
          <Route path="profile" element={<ProfilePage user={user}/>}/>
          <Route path="upcoming-features" element={<UpcomingFeatures/>}/>
        </Route>
      </Route>
    )
  )

  return loading? (<LoadingScreen/>): user ? (
     <>
      <RouterProvider router={router} />
    </>
  ): (
    <>
    <ToastContainer/>
    <Login/>
    </>
  )
}

export default App;
