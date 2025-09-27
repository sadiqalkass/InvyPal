import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import { addTransaction } from "../lib/actions/transaction.actions";
import { toast } from "react-toastify";
import { Link } from "react-router";
import Invoice from "../components/Invoice";

const Sell = () => {
  const { stockItems, user, getTransactions, company } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadPage, setLoadPage] = useState(false);
  const [receptInfo, setReceptInfo] = useState([]);
  const [formData, setFormData] = useState({
    itemId: "",
    price: "",
    quantitySold: "",
    userId: user.$id,
    companyId: user.companyId,
  });
  const [items, setItems] = useState([]);
  const [showRecept, setShowRecept] = useState(false);

  const getTotalPrice = () => {
    if (formData.price && formData.quantitySold) {
      return formData.price * formData.quantitySold;
    }
  };

  const listItems = items.map((item) => (
    <option key={item.$id} value={item.$id}>
      {item.name}
    </option>
  ));

  useEffect(() => {
    const getData = async () => {
      try {
        setShowRecept(false);
        setLoadPage(true);
        setItems(stockItems);
      } finally {
        setLoadPage(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (formData.itemId) {
      const itemPrice = items.filter((item) => item.$id === formData.itemId);
      setFormData({
        ...formData,
        price: itemPrice[0].price,
      });
    }
  }, [formData.itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" || name === "quantity") {
      setFormData({ ...formData, [name]: Number(value) });
      console.log(value);
    }
    setFormData({ ...formData, [name]: value });
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { userId, companyId, quantitySold, itemId } = formData;
      const response = await addTransaction(
        itemId,
        quantitySold,
        userId,
        companyId
      );
      if (response.success) {
        toast.success(response.message);
        setReceptInfo({
          id: response.transaction.$id,
          date: response.transaction.$createdAt,
          items: [{ ...response.transaction, price: formData.price }],
        });
        getTransactions();
      }
      setShowRecept(true);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return loadPage ? (
    <LoadingScreen />
  ) : (
    <form
      onSubmit={onSubmitHandle}
      className="m-2 w-[90%] md:m-4 md:mt-7 md:w-full"
    >
      <p className="mb-3 text-lg font-medium">Sell Item</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] ml-3 overflow-scroll">
        {!showRecept && (
          <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
            {/* 1st half */}
            <div className="md:flex md:flex-row w-full lg:flex-1 flex-col gap-4">
              <div className="flex lg:flex-1 flex-col gap-4 w-full">
                <div className="flex flex-1 gap-1 flex-col">
                  <p>Item Name</p>
                  <select
                    className="border rounded px-3 py-2"
                    name="itemId"
                    value={formData.itemId}
                    onChange={handleChange}
                  >
                    <option value="">------</option>
                    {items.length ? (
                      listItems
                    ) : (
                      <option value="">No Items In stock</option>
                    )}
                  </select>
                </div>

                <div className="flex flex-1 gap-1 flex-col">
                  <p>Price</p>
                  <input
                    className="border rounded px-3 py-2"
                    type="number"
                    placeholder="price"
                    name="price"
                    disabled
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* 2nd half */}
              <div className="flex lg:flex-1 flex-col gap-5 w-full">
                <div className="flex flex-1 gap-1 flex-col">
                  <p>Quantity</p>
                  <input
                    className="border rounded px-3 py-2"
                    type="number"
                    placeholder="quantity"
                    name="quantitySold"
                    value={formData.quantitySold}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex-1">
                  <p>Total</p>
                  <p className="text-xl text-primary pl-1">
                    ₦ {getTotalPrice()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* bottom half */}
        <div className="flex gap-2 justify-start">
          {!showRecept && (
            <button
              type="submit"
              className="bg-primary px-10 py-3 mt-4 text-white rounded-full cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                "Sell Item"
              )}
            </button>
          )}
          {showRecept && <Invoice company={company} transaction={receptInfo} />}
        </div>
      </div>
    </form>
  );
};

export default Sell;
