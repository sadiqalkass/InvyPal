import { toast } from "react-toastify";
import { assests } from "../assests/assests";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { NavLink } from "react-router";

const Navbar = () => {
  const { logout, user, company } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const logoutUser = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    user && (
      <div className="flex justify-between items-center px-4 sm:px-4 py-2 border-b bg-white">
        <div className="flex items-center text-xs">
          <div className="overflow-hidden h-[50px] flex justify-start items-center w-[150px]">
            <img
              src={assests.logo}
              className="md:w-[250px] w-[85%]"
              alt="InvyPal logo"
            />
          </div>
          <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 hidden md:block">
            {user.role}
          </p>
        </div>

        <div className="p-3 rounded-xl hidden md:flex flex-col item-center justify-center text-center">
          <img
            src={
              company?.companyLogo ? company.companyLogo : assests.company_logo
            }
            className="w-12 ml-2 rounded-full border"
            alt=""
          />
          <p className="text-[11px] text-gray-600 text-center">
            {company?.name ? company.name : "...."}
          </p>
        </div>

        <button
          type="submit"
          className="bg-primary hidden md:block rounded-md text-base text-white py-2 cursor-pointer w-[100px]"
          disabled={loading}
          onClick={logoutUser}
        >
          {loading ? (
            <span class="loading loading-dots loading-md"></span>
          ) : (
            "Logout"
          )}
        </button>

        {/* ---------Mobile Menu --------- */}
        <div className="flex items-center gap-4 md:hidden">
          <span
            className="text-2xl md:hidden cursor-pointer transition-all duration-300"
            onClick={() => setShowMenu(true)}
          >
            <ion-icon name="menu-outline"></ion-icon>
          </span>
          <div
            className={`${showMenu ? "fixed w-[70%]" : "h-0 w-0"} mb:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-gray-100 transition-all duration-300`}
          >
            <div className="flex items-center justify-between px-5 py-6">
              <div className="p-3 rounded-xl flex flex-col item-center justify-center text-center">
                <img
                  src={
                    company?.companyLogo
                      ? company.companyLogo
                      : assests.company_logo
                  }
                  className="w-12 rounded-full"
                  alt=""
                />

                <p className="text-[10px] text-gray-600 text-center">
                  {company?.name ? company.name : "......"}
                </p>
              </div>
              <span
                className="text-xl cursor-pointer"
                onClick={() => setShowMenu(false)}
              >
                <ion-icon name="close-outline"></ion-icon>
              </span>
            </div>
            <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-xl font-medium">
              <NavLink
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded inline-block ${isActive ? "bg-blue-400 text-white" : ""}`
                }
                to="/"
              >
                <p className="px-4 py-2 rounded inline-block">Dashboard</p>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `px-4 py-2 rounded inline-block ${isActive ? "bg-blue-400 text-white" : ""}`
                }
                onClick={() => setShowMenu(false)}
                to="/stock"
              >
                <p>Stock</p>
              </NavLink>
              {user.role === "admin" && (
                <>
                  <NavLink
                    className={({ isActive }) =>
                      `px-4 py-2 rounded inline-block ${isActive ? "bg-blue-400 text-white" : ""}`
                    }
                    onClick={() => setShowMenu(false)}
                    to="/category"
                  >
                    <p>Category</p>
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      `px-4 py-2 rounded inline-block ${isActive ? "bg-blue-400 text-white" : ""}`
                    }
                    onClick={() => setShowMenu(false)}
                    to="/add-stock"
                  >
                    <p>Add Stock</p>
                  </NavLink>
                </>
              )}
              <NavLink
                className={({ isActive }) =>
                  `px-4 py-2 rounded inline-block ${isActive ? "bg-blue-400 text-white" : ""}`
                }
                onClick={() => setShowMenu(false)}
                to="/profile"
              >
                <p>Profile</p>
              </NavLink>
              <button
                type="submit"
                className="bg-primary rounded-md text-base text-white py-2 cursor-pointer w-[100px]"
                disabled={loading}
                onClick={logoutUser}
              >
                {loading ? (
                  <span class="loading loading-dots loading-md"></span>
                ) : (
                  "Logout"
                )}
              </button>
            </ul>
          </div>
        </div>
      </div>
    )
  );
};

export default Navbar;
