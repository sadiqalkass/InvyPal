import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createCategory } from "../lib/actions/category.actions";
import { toast } from "react-toastify";

const AddCategory = () => {
  const { user, getCategories } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    userId: user.$id,
    companyId: user.companyId,
  });
  const onSubmitHandle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // await createCategory(formData)
      const { name, description, userId, companyId } = formData;
      const response = await createCategory(
        name.toUpperCase(),
        description,
        userId,
        companyId
      );
      if (response.success) {
        toast.success(response.message);
        setFormData({
          name: "",
          description: "",
          userId: user?.$id || "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <form
      onSubmit={onSubmitHandle}
      className="m-2 md:m-4 md:mt-7 w-[85%] md:w-full"
    >
      <p className="text-lg mb-3 font-medium">Create Category</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-hidden ml-3">
        <div className="w-full">
          <p>Category Name</p>
          <input
            type="text"
            name="name"
            value={formData.name}
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

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-dots loading-md"></span>
          ) : (
            "Create"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddCategory;
