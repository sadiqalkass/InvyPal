import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Lable"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs"
import { Upload } from "lucide-react"

export default function ProfilePage({ user }) {
  const [logo, setLogo] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogo(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="w-full py-5 px-4">
      {/* Page Title */}
      <h1 className="text-xl font-bold text-gray-900 mb-3">My Account</h1>
         {/* Change Password */}
      <div className="mt-2 text-center">
        <a href="/change-password" className="text-primary font-medium hover:underline">
          Change Password
        </a>
      </div>

      <Tabs defaultValue="profile" className="w-[200px]">
        <TabsList className="grid grid-cols-2 w-full rounded-xl bg-gray-100 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {user?.role === "admin" && <TabsTrigger value="company">Company</TabsTrigger>}
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className='md:w-[70vw] w-[90vw]'>
          <Card className="shadow-md border rounded-2xl w-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                <Input defaultValue={user?.name || ""} className="mt-2 w-full" />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Email</Label>
                <Input defaultValue={user?.email || ""} disabled className="mt-2 bg-gray-100" />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Role</Label>
                <Input value={user?.role || "Staff"} disabled className="mt-2 bg-gray-100" />
              </div>

              <Button className="w-full text-white cursor-pointer">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company (Admins only) */}
        {user?.role === "admin" && (
          <TabsContent value="company" className='w-[70vw]'>
            <Card className="shadow-md border rounded-2xl ">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Company Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                    {preview ? (
                      <img src={preview} alt="Company Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload className="w-10 h-10" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-3">Upload your company logo</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Company Name</Label>
                  <Input defaultValue={user?.companyName || "InvyMate Ltd."} className="mt-2" />
                </div>

                <Button className="w-full text-white cursor-pointer">Save Company Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}