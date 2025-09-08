import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { deleteCategory } from "../lib/actions/category.actions";

const DeleteCategoryButton = ({ category, onDelete }) => {
  const [open, setOpen] = useState(false);
 const { getCategories } = useAuth();

    const handleDelete = async () => {
      try{
        const response = await deleteCategory(category.$id)
        if(response.success){
          toast.success(response.message)
          getCategories()
          setOpen(false);
        }
      }catch{
       console.log(error)
       toast.error(error.message)
       setOpen(false)
      }
    }

  const isDefaultCategory = category.name.toLowerCase() === "general";

  const handleClick = () => {
    if (isDefaultCategory) {
      toast.error("Default category cannot be deleted!");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`${
          isDefaultCategory
            ? "text-gray-400 cursor-not-allowed"
            : "text-red-500 hover:text-red-600 cursor-pointer"
        }`}
      >
        <ion-icon name="trash-outline"></ion-icon>
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800">
              Delete Category
            </h2>
            <p className="mt-2 text-gray-600 text-sm">
              You are about to delete the category{" "}
              <span className="font-medium text-red-500">
                {category.name}
              </span>.  
              This will also delete all stock items inside it.  
              Are you sure you want to continue?
            </p>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteCategoryButton;
