import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateCategory } from "../lib/actions/category.actions";
import { updateStockItem } from "../lib/actions/stock.actions";
import { toast } from "react-toastify";
import { redirect, useNavigate } from "react-router";

const UpdateForm = ({ state, category, stockItem }) => {
  const { categories } = useAuth();
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    active: false,
    cateName: '',
    itemName: '',
    price: '',
    description: '',
    itemCateId: '',
    cateId: '',
    itemId: '',
    quantity: '',
    imgId: ''
  });
  const [loading, setLoading] = useState(false);
  const [itemImg, setItemImg] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" || name === "quantity") {
      setFormData({ ...formData, [name]: Number(value) });
    }
    setFormData({ ...formData, [name]: value });
  };

  const listCategories = categories.map((category) => (
    <option key={category.$id} value={category.$id}>
      {category.name}
    </option>
  ));

  useEffect(()=>{
    setFormData({
    active: true,
      cateName: category?.name,
    itemName: stockItem?.name,
    price: stockItem?.price,
    description: category?.description,
    itemCateId: stockItem?.categoryId,
    cateId: category?.$id,
    itemId: stockItem?.$id,
    quantity: stockItem?.quantity,
    imgId: stockItem?.imgId,
    })
  },[])
  console.log(stockItem)

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    try {
      if (state === "Category") {
        setLoading(true)
        const response = await updateCategory(
          formData.cateId,
          formData.cateName.toUpperCase(),
          formData.description
        );
        if (response.success) {
          toast.success(response.message);
          setFormData({ ...formData, cateName: "", description: "" });
          navigate("/category/list");
        }
      }
      if (state === "Stock") {
        setLoading(true)
        const response = await updateStockItem(
          formData.itemId,
          itemImg,
          formData.itemName,
          formData.itemCateId,
          formData.quantity,
          formData.price,
          formData.imgId
        );
        if (response.success) {
          setFormData({
            ...formData,
            itemId: "",
            itemName: "",
            itemCateId: "",
            quantity: "",
            price: "",
            imgId: "",
            imgUrl: "",
          });
          setItemImg(false)
          toast.success(response.message)
          navigate('/stock')
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return formData.active && (
    <form onSubmit={onSubmitHandle}>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] ml-3 overflow-scroll">
        {state === "Stock" ? (
          <>
            <div className="flex items-center gap-4 mb-8 text-gray-500">
              {/* this work because of the similer id */}
              <label htmlFor="item-img">
                <img
                  className="w-[50px] h-[50px] bg-gray-100 rounded-2xl cursor-pointer"
                  src={
                    itemImg ? URL.createObjectURL(itemImg) : stockItem?.imgUrl
                  }
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
                Change item <br /> picture
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
                    name="itemName"
                    value={formData.itemName}
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
                    name="itemCateId"
                    value={formData.itemCateId}
                    onChange={handleChange}
                  >
                    <option value="">------</option>
                    {categories.length ? (
                      listCategories
                    ) : (
                      <option value="">No categories</option>
                    )}
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
          </>
        ) : (
          <>
            <div className="w-full">
              <p>Category Name</p>
              <input
                type="text"
                name="cateName"
                value={formData.cateName}
                onChange={handleChange}
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                required
              />
            </div>
            <div>
              <p className="mt-4 mb-2">Category description</p>
              <textarea
                className="w-full border rounded px-4 pt-2"
                placeholder="Write about category(max 1000 characters)"
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        <div>
          <button
            type="submit"
            className="bg-primary px-10 py-3 mt-4 text-white rounded-full cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-dots loading-md"></span>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateForm;
