import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DeleteCategoryButton from "../components/DeleteCategoryButton";
import { Link } from "react-router";

const CategoryList = () => {
  const { categories, stockItems, getCategories, getStockItems, user} = useAuth();
  const [loading, setLoading] = useState(true);

  const getItemsCount = (cateId) =>{
    const stockItemCount = stockItems.filter(item => item.categoryId === cateId)
    return stockItemCount.length
  }

 useEffect(() => {
  const fetchData = async () => {
    try {
      await Promise.all([getStockItems(), getCategories()]);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
  return loading ? (<LoadingScreen/>) : (
    <div className="w-[90%] m-4 max-w-[65rem] md:m-5">
      <p className="mb-3">Category List</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll scrollbar-hide">
        <div className="hidden sm:grid grid-cols-[0.5fr_1fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Name</p>
          <p>Descrption</p>
          <p>Items</p>
          <p>Actions</p>
        </div>
        {categories.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_1fr_3fr_1fr_1fr] text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>

            <div className="flex items-center">
              <p>{item.name.length  > 10 ? `${item.name.slice(0, 10)}...` : item.name}</p>
            </div>

            <p className="max-sm:hidden">{item.description.slice(0, 30)}....</p>

            <div className="flex items-center">
            <p className="pl-2">{getItemsCount(item.$id)}</p>
            </div>

            <div className="flex items-center gap-5">
              <p
                className="text-red-400 text-xl cursor-pointer"
              >
                <DeleteCategoryButton category={item} />
              </p>
              <Link to={`/category/${item.$id}`}>
              <p className="text-green-400 text-xl cursor-pointer">
                <ion-icon name="pencil-outline"></ion-icon>
              </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
