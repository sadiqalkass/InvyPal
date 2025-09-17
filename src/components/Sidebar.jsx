import React from "react";
import { NavLink } from "react-router";
import {useAuth} from '../context/AuthContext'

const Sidebar = () => {
  const {user} = useAuth()
  return (
    <div className="hidden md:block w-[250px] min-h-[90vh] bg-white border-r">
    <ul className="text-[#515151] mt-5">
      <NavLink
        className={({ isActive }) =>
          `flex items-center text-[17px] gap-3 py-6 md:px-9 md:min-w-60 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`
        }
        to={"."}
      >
        <ion-icon name="home-outline"></ion-icon>
        <p className="hidden md:block">Dashboard</p>
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `flex items-center text-[17px] gap-3 py-6 md:px-9 md:min-w-60 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`
        }
        to={"/stock"}
      >
        <ion-icon name="file-tray-stacked-outline"></ion-icon>
        <p className="hidden md:block">Stock</p>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `flex items-center text-[17px] gap-3 py-6 md:px-9 md:min-w-60 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`
        }
        to={"/transactions"}
      >
        <ion-icon name="cash-outline"></ion-icon>
        <p className="hidden md:block">Transactions</p>
      </NavLink>
        {user.role === 'admin' && (
          <>

        <NavLink
          className={({ isActive }) =>
            `flex items-center text-[17px] gap-3 py-6 md:px-9 md:min-w-60 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`
          }
          to={"/category"}
        >
          <ion-icon name="bag-add-outline"></ion-icon>
          <p className="hidden md:block">Category</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center text-[17px] gap-3 py-6 md:px-9 md:min-w-60 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`
          }
          to={"/add-stock"}
        >
          <ion-icon name="add"></ion-icon>
          <p className="hidden md:block">Add Stock</p>
        </NavLink>
          </>
        )}

      <NavLink
        className={({ isActive }) =>
          `flex items-center text-[17px] gap-3 py-6 md:px-9 md:min-w-60 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`
        }
        to={"/profile"}
      >
        <ion-icon name="person-outline"></ion-icon>
        <p className="hidden md:block">Profile</p>
      </NavLink>
    </ul>
    </div>
  );
};

export default Sidebar;
