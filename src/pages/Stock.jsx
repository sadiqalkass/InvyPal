import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import { toast } from "react-toastify";
import { deleteStockItem } from "../lib/actions/stock.actions";
import { Link } from "react-router";


const Stock = () => {
  const { stockItems, getStockItems, getCategories, categories, user} = useAuth();
  const [stock, setStock] = useState([]);
  const [cateId, setCateId] = useState(null);
  const [filtredCategories, setFiltredCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategory = (categoryId) => {
    const filteratedCategory = categories.filter(
      (cate) => cate.$id === categoryId
    );
    const categoryName = filteratedCategory[0].name;
    return categoryName;
  };

  const deleteItemHandle = async (itemId, fileId) => {
    try {
      const response = await deleteStockItem(itemId, fileId);
      if (response.success) {
        getStockItems();
        toast.success(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.warn(error.message);
    }
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true)
      if (user) {
        await Promise.all([getStockItems(), getCategories()]);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

// update filtered categories whenever stockItems OR categories change
useEffect(() => {
  const itemCategoryIds = stockItems.map((item) => item.categoryId);
  const filteredCate = categories.filter((cat) =>
    itemCategoryIds.includes(cat.$id)
  );
  setFiltredCategories(filteredCate);
}, [stockItems, categories]);

// update filtered stock whenever cateId OR stockItems change
useEffect(() => {
  if (!cateId) {
    setStock(stockItems);
  } else {
    const filteredItems = stockItems.filter(
      (item) => item.categoryId === cateId
    );
    setStock(filteredItems);
  }
}, [cateId, stockItems]);



  return loading ? (
    <LoadingScreen />
  ) : categories.length ? (
    <div className="w-full max-w-6xl m-5">
      {stock.length ? (
        <>
          <div className="flex gap-2 items-center">
            <div className="flex gap-3 items-center mb-1">
              <p className="text-lg font-medium">Stock</p>
                {/* Only show Add Stock if user is admin */}
        {user?.role === "admin" && (
          <Link
            to="/add-stock"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            + Add Stock
          </Link>
        )}
            </div>
            
            <span
              className={
                cateId
                  ? "text-blue-500 text-[18px] cursor-pointer text-center pb-1"
                  : "hidden"
              }
              onClick={() => setCateId(null)}
            >
              <ion-icon name="reload-outline"></ion-icon>
            </span>
          </div>
          <div>
            {filtredCategories.map((cate) => (
              <button
                onClick={() => setCateId(cate.$id)}
                key={cate.$id}
                className={`m-3 rounded-md  ${cateId === cate.$id ? "bg-blue-500 text-white hover:bg-blue-400" : "bg-gray-200 hover:bg-gray-100"}  px-3.5 py-2.5 text-sm font-semibold text-black inset-ring inset-ring-white/5  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer`}
              >
                {cate.name}
              </button>
            ))}
          </div>

          <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
            <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr] grid-flow-col py-3 px-6 border-b">
              <p>#</p>
              <p>Name</p>
              <p>Quantity</p>
              <p>Category</p>
              <p>Price(₦)</p>
              <p>Actions</p>
            </div>

            {stock.map((item, index) => (
              <div
                key={index}
                className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr] text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
              >
                <p className="max-sm:hidden">{index + 1}</p>

                <div className="flex items-center gap-2">
                  <img className="w-8 rounded-full h-8 hidden md:block" src={item.imgUrl} alt="" />
                  <p>{item.name.length  > 10 ? `${item.name.slice(0, 10)}...` : item.name}</p>
                </div>

                <p className={`max-sm:hidden ${Number(item.quantity) < 5? 'text-red-600': ''}`}>{item.quantity}</p>
                <p className="text-[10px] md:text-sm flex justify-center items-center md:block">{getCategory(item.categoryId)}</p>

                <div className="flex items-center gap-2">
                  <p>{item.price}</p>
                </div>
                <div className="flex items-center gap-5">
                  {user.role === 'admin' && 
                    <p
                      className="text-red-400 text-xl cursor-pointer"
                      onClick={() => deleteItemHandle(item.$id, item?.imgId)}
                    >
                      <ion-icon name="trash-outline"></ion-icon>
                    </p>
                  }
                  <Link to={`/stock/${item.$id}`}>
                  <p className="text-green-400 text-xl cursor-pointer">
                    <ion-icon name="pencil-outline"></ion-icon>
                  </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-400 text-center py-10">No stock items yet</p>
      )}
    </div>
  ) : (
    <p className="text-gray-400 text-center py-10">No categories yet</p>
  );
};

export default Stock;
