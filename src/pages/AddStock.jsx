import { use, useEffect, useState } from "react";
import { assests } from "../assests/assests";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { addToStock } from "../lib/actions/stock.actions";
import LoadingScreen from "../components/LoadingScreen";

const AddStock = () => {
    const {categories, getStockItems, user} = useAuth()
    const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    quantity: "",
    userId: user.$id,
    companyId: user.companyId
  });
  const [loading, setLoading] = useState(false);
  const [itemImg, setItemImg] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" || name === "quantity") {
      setFormData({ ...formData, [name]: Number(value) });
      console.log(value)
    }
    setFormData({ ...formData, [name]: value });
  };

  const listCategories = categories.map((category) => (
    <option key={category.$id} value={category.$id}>
      {category.name}
    </option>
  ));
  const onSubmitHandle = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (!itemImg) {
        toast.error("Please selcet an image")
        setLoading(false)
        return
    }
    const {name, price, quantity, categoryId, userId, companyId} = formData
    const imgFile = itemImg
    try {
        const response = await addToStock(imgFile, name, categoryId, quantity, price, userId, companyId)
        if (response.success) {
            toast.success(response.message)
            setFormData({
                name:'',
                quantity:'',
                categoryId:'',
                price:''
            })
            setItemImg(false)
        } 
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }finally{
        setLoading(false)
    }
  };
  return categories.length? (
    <form onSubmit={onSubmitHandle} className="m-2 w-[90%] md:m-4 md:mt-7 md:w-full">
      <p className="mb-3 text-lg font-medium">Add to Stock</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] ml-3 overflow-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          {/* this work because of the similer id */}
          <label htmlFor="item-img">
            <img
              className="w-[50px] h-[50px] bg-gray-100 rounded-2xl cursor-pointer"
              accept="image/*"
              src={itemImg ? URL.createObjectURL(itemImg) : assests.image_area}
              alt="upload icon"
            />
          </label>
          <input
            type="file"
            id="item-img"
            onChange={(e) => setItemImg(e.target.files[0])}
            hidden
          />
          <p>
            Upload item <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* 1st half */}
          <div className="flex w-full lg:flex-1 flex-col gap-4">
            <div className="flex flex-1 gap-1 flex-col">
              <p>Name</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-1 gap-1 flex-col">
              <p>Price</p>
              <input
                className="border rounded px-3 py-2"
                type="number"
                placeholder="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* 2nd half */}
          <div className="flex lg:flex-1 flex-col gap-4 w-full">
            <div className="flex flex-1 gap-1 flex-col">
              <p>Category</p>
              <select
                className="border rounded px-3 py-2"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">------</option>
               {categories.length ? listCategories : <option value="">No categories</option>}
              </select>
            </div>

            <div className="flex flex-1 gap-1 flex-col">
              <p>Quantity</p>
              <input
                className="border rounded px-3 py-2"
                type="number"
                placeholder="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* bottom half */}
        <div>
          <button
            type="submit"
            className="bg-primary px-10 py-3 mt-4 text-white rounded-full cursor-pointer"
           disabled={loading}
          >
            {loading? <span className="loading loading-dots loading-md"></span>: 'Add Stock'}
          </button>
        </div>
      </div>
    </form>
  ): (
    <LoadingScreen/>
    )
}

export default AddStock;
