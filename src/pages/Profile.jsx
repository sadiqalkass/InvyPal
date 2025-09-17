import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Lable";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/Tabs";
import { Upload } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { updateUserInfo } from "../lib/actions/user.actions";
import { updateCompanyInfo } from "../lib/actions/company.actions";

export default function ProfilePage({ user, company }) {
  const { getCompanyDets, checkUser } = useAuth();
  const [formData, setFormData] = useState({
    userId: user.$id,
    name: user.name,
    companyId: company?.$id,
    companyName: company?.name,
  });
  const [logo, setLogo] = useState(false);
  const [loading, setLoading] = useState(false);

  const updatePersonalInfo = async () => {
    try {
      setLoading(true);
      const { userId, name } = formData;
      const response = await updateUserInfo(userId, name);
      if (response.success) {
        toast.success(response.message);
        checkUser()
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateComapanyInfo = async () => {
    try {
      setLoading(true);
      const name = formData.companyName
      const imgFile = logo
      const response = await updateCompanyInfo(formData.companyId, imgFile, name)
      if (response.success) {
        toast.success(response.message)
        getCompanyDets()
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
    <div className="w-full py-3 px-4">
      <div>
        {/* Page Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-3">My Account</h1>
      </div>

      <Tabs defaultValue="profile" className="w-[200px]">
        <TabsList className="grid grid-cols-2 w-full rounded-xl bg-gray-100 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {user?.role === "admin" && (
            <TabsTrigger value="company">Company</TabsTrigger>
          )}
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="md:w-[70vw] w-[90vw]">
          <Card className="shadow-md border rounded-2xl w-full py-3">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Full Name
                </Label>
                <Input
                  className="mt-2 w-full"
                  onChange={handleChange}
                  name='name'
                  value={formData.name}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Email
                </Label>
                <Input
                  defaultValue={user?.email || ""}
                  disabled
                  className="mt-2 bg-gray-100"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Role
                </Label>
                <Input
                  value={user?.role || "Staff"}
                  disabled
                  className="mt-2 bg-gray-100"
                />
              </div>

              <Button
                className="w-full text-white cursor-pointer"
                onClick={updatePersonalInfo}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company (Admins only) */}
        {user?.role === "admin" && (
          <TabsContent value="company" className="md:w-[70vw] w-[90vw]">
            <Card className="shadow-md border rounded-2xl py-3">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Company Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                    {logo ? (
                      <img
                        src={URL.createObjectURL(logo)}
                        alt="Company Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload className="w-10 h-10" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogo(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    Upload your company logo
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Company Name
                  </Label>
                  <Input
                    className="mt-2"
                    onChange={handleChange}
                    name='companyName'
                    value={formData.companyName}
                  />
                </div>

                <Button
                  className="w-full text-white cursor-pointer"
                  onClick={updateComapanyInfo}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-dots loading-md"></span>
                  ) : (
                    "Save Company Settings"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
