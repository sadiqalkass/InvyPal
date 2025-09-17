import { ToastContainer } from "react-toastify";
import "./App.css";
import Login from "./pages/Login";
import { createBrowserRouter, Route, RouterProvider } from "react-router";
import { createRoutesFromElements } from "react-router";
import Home from "./pages/Home";
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
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Sell from "./pages/Sell";
import TransactionTable from "./pages/TransactionTable";
import Transactionslayout from "./layout/Transactionslayout";

function App() {
  const { loading, user, company } = useAuth();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Admin Only Routes */}
          <Route
            path="category"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <CategoryLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AddCategory />} />
            <Route path="list" element={<CategoryList />} />
            <Route path=":id" element={<EditCategory />} />
          </Route>

          <Route
            path="add-stock"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AddStock />
              </ProtectedRoute>
            }
          />

          {/* Admin + Staff Routes */}
          <Route
            path="stock"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin", "staff"]}>
                <Stock />
              </ProtectedRoute>
            }
          />
          <Route
            path="stock/:id"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin", "staff"]}>
                <EditStockItem />
              </ProtectedRoute>
            }
          />

          {/* Shared Routes */}
          <Route
            path="profile"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin", "staff"]}>
                <ProfilePage user={user} company={company} />
              </ProtectedRoute>
            }
          />
          <Route
            path="transactions"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin", "staff"]}>
                <Transactionslayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TransactionTable />} />
            <Route path="sell" element={<Sell />} />
          </Route>
          <Route path="upcoming-features" element={<UpcomingFeatures />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    )
  );

  return loading ? (
    <LoadingScreen />
  ) : user ? (
    <>
      <RouterProvider router={router} />
    </>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  );
}

export default App;
