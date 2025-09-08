import React, { useState } from "react"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Lable"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs"
import { Upload } from "lucide-react"

export default function ProfilePage({ user }) {
  const [logo, setLogo] = useState(null)
  const [preview, setPreview] = useState(null)

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogo(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          {user?.role === "Admin" && <TabsTrigger value="company">Company Settings</TabsTrigger>}
        </TabsList>

        {/* My Profile Tab */}
        <TabsContent value="profile">
          <Card className="mt-6 shadow-lg rounded-2xl">
            <CardContent className="space-y-6 p-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" defaultValue={user?.name || ""} />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ""} />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" type="text" value={user?.role || "Staff"} disabled />
              </div>

              <Button className="w-full">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Settings Tab - Only Admins */}
        {user?.role === "Admin" && (
          <TabsContent value="company">
            <Card className="mt-6 shadow-lg rounded-2xl">
              <CardContent className="space-y-6 p-6">
                {/* Logo Upload */}
                <div className="flex flex-col items-center">
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200 shadow">
                    {preview ? (
                      <img src={preview} alt="Company Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload className="w-8 h-8" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Click above to upload or change logo</p>
                </div>

                {/* Company Name */}
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" type="text" defaultValue={user?.companyName || "InvyMate Ltd."} />
                </div>

                <Button className="w-full">Save Company Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Change Password */}
      <div className="mt-6 text-center">
        <a href="/change-password" className="text-blue-600 hover:underline text-sm">
          Change Password
        </a>
      </div>
    </div>
  )
}
