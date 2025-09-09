import { useEffect, useState } from "react";
import UpdateForm from "../components/UpdateForm";
import LoadingScreen from "../components/LoadingScreen";
import { useParams } from "react-router";
import { fetchCategoryById } from "../lib/actions/category.actions";
import { useAuth } from "../context/AuthContext";

const EditCategory = () => {
    const {user} = useAuth()
    const {id} = useParams()
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        const getCategory = async () => {
            try {
              console.log(id, 'category id')
                setLoading(true)
                const category = await fetchCategoryById(id);
                setCategory(category)
                console.log(category, 'edit category')
            } catch (error) {
               console.log(error)
               toast.error(error.message) 
            }finally{
                setLoading(false)
            }
        }
        getCategory();
    },[])
  return user.role === 'admin' && loading? <LoadingScreen/> : category && (
    <div className="m-4 md:mt-7 w-full">
      <p className="mb-3 text-lg font-medium">
        Edit Category
      </p>
    <UpdateForm state={'Category'} category={category} />
    </div>
  );
};

export default EditCategory;
