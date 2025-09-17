import { NavLink, Outlet } from "react-router"

const Transactionslayout = () => {
  return (
    <div className="w-full overflow-scroll h-full md:max-h-[90vh]">
      <div className="flex gap-2 items-center justify-center bg-white border-b py-0 z-10">
        <NavLink to='' end className={({ isActive }) =>`text-primary p-3 ${isActive ? "bg-[#F2F3FF] border-b-3 border-primary" : ""}`}>Table</NavLink>
        <NavLink to='sell' className={({ isActive }) =>`text-primary p-3 ${isActive ? "bg-[#F2F3FF] border-b-3 border-primary" : ""}`}>Sell</NavLink>
      </div>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default Transactionslayout
