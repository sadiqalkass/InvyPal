import { useState } from "react";
import { assests } from "../assests/assests";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [state, setstate] = useState("Login");
  const { login, signup } = useAuth();
  const [formData, setFormData] = useState({
    companyName: "",
    password: "",
    name: "",
    email: "",
    role: "",
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const onSubmitHandle = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    if (state === "Sign Up") {
      const { email, password, name, companyName, companyId, role } = formData;
      if (role === 'admin') {
        await signup(email, password, name, role, companyName, null);
      } else {
        await signup(email, password, name, role, null, companyId);
      }
    } else {
      const { email, password } = formData;
      await login(email, password);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="flex w-full">
      {/* First half */}
      <div className="px-2 w-[100%] min-h-[100vh] flex flex-col items-center justify-center gap-0">
        <div
          className={`md:hidden flex flex-col ${state === "Login" ? "mb[-10%]" : "mb-2"}`}
        >
          <div className="overflow-hidden h-[70px] flex justify-center items-center w-full">
            <img src={assests.logo} className="w-[200px]" alt="brand logo" />
          </div>
          <p className="p-0 m-0">
            <i>Your smart companion for inventory management</i>
          </p>
        </div>
        <form
          onSubmit={onSubmitHandle}
          className="min-h-[80vh] flex items-center mb-1"
        >
          <div className="flex flex-col gap-3 m-auto items-start p-7 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-sm ">
            <p className="text-2xl font-semibold">
              {state === "Sign Up" ? "Create Account" : "Login"}
            </p>
            <p>
              Please {state === "Sign Up" ? "sign up" : "log in"} to begin your
              inventory
            </p>
            {state === "Sign Up" ? (
              <>
                <div className="w-full">
                  <p>Full Name</p>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border border-zinc-300 rounded w-full p-2 mt-1"
                    required
                  />
                </div>

                <div className="w-full">
                  <p>Role</p>
                  <select
                    name="role"
                    className="border border-zinc-300 rounded w-full p-2 mt-1"
                    onChange={handleChange}
                    id=""
                  >
                    <option value="blank">----</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                {formData.role &&
                  (formData.role === "admin" ? (
                    <div className="w-full">
                      <p>Company Name</p>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="border border-zinc-300 rounded w-full p-2 mt-1"
                        required
                      />
                    </div>
                  ) : (
                    <div className="w-full">
                      <p>Company Id</p>
                      <input
                        type="text"
                        name="companyId"
                        value={formData.companyId}
                        onChange={handleChange}
                        className="border border-zinc-300 rounded w-full p-2 mt-1"
                        required
                      />
                    </div>
                  ))}
              </>
            ) : null}

            <div className="w-full">
              <p>Email</p>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                required
              />
            </div>

            <div className="w-full">
              <p>Password</p>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-primary w-full rounded-md text-base text-white py-2 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : state === "Sign Up" ? (
                "Create Account"
              ) : (
                "Login"
              )}
            </button>
            {state === "Sign Up" ? (
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => setstate("Login")}
                  className="text-primary underline cursor-pointer"
                >
                  Login here
                </span>{" "}
              </p>
            ) : (
              <p>
                Create a new account?{" "}
                <span
                  onClick={() => setstate("Sign Up")}
                  className="text-primary underline cursor-pointer"
                >
                  Click here
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
      {/* Second Half */}
      <div className="flex-col justify-center w-full items-center bg-blue-50 hidden md:flex">
        <div className="overflow-hidden h-[70px] flex justify-start items-center w-[50%]">
          <img src={assests.logo} className="w-[200px]" alt="brand logo" />
        </div>
        <p className="">
          <i>Your smart companion for inventory management</i>
        </p>
        <img src={assests.logndash} className="h-[400px] w-[50%] pt-7" alt="" />
      </div>
    </div>
  );
};

export default Login;
