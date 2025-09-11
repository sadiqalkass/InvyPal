import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UpdateForm from "../components/UpdateForm";
import LoadingScreen from "../components/LoadingScreen";
import { useParams } from "react-router";
import { fetchStockItemById } from "../lib/actions/stock.actions";

const EditStockItem = () => {
  const {user} = useAuth()
  const { id } = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getStockItem = async () => {
      try {
        setLoading(true);
        const stItem = await fetchStockItemById(id);
        setStock(stItem);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getStockItem();
  }, []);
  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="m-4 md:mt-7 w-full">
      <p className="mb-3 text-lg font-medium">Edit Stock Item</p>
      <UpdateForm state={"Stock"} stockItem={stock} />
    </div>
  );
};

export default EditStockItem;
