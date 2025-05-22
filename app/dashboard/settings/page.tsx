"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2, Save } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toaster"

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Settings saved",
        description: "Your profile settings have been updated successfully.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-gray-900 border-gray-800">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#9c89B8] data-[state=active]:text-white">
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-[#F0A6CA] data-[state=active]:text-black">
            Account
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-[#E7BCDE] data-[state=active]:text-black"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className="bg-gradient-to-br from-black to-gray-900 border-[#9c89B8]/30">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile details and public information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <UserAvatar name={user?.name || ""} image={user?.profileImage} size="xl" />
                <div>
                  <Button variant="outline" className="border-[#9c89B8] text-[#9c89B8] mb-2">
                    Change Avatar
                  </Button>
                  <p className="text-xs text-gray-400">Recommended: Square image, at least 200x200px</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Full Name
                  </Label>
                  <Input id="name" defaultValue={user?.name} className="bg-gray-900 border-gray-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300">
                    Username
                  </Label>
                  <Input
                    id="username"
                    defaultValue={user?.username}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-300">
                  Bio
                </Label>
                <textarea
                  id="bio"
                  rows={4}
                  defaultValue={user?.bio || ""}
                  className="w-full rounded-md bg-gray-900 border border-gray-700 text-white p-2"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {user?.interests?.map((interest, index) => (
                    <Badge key={index} className="bg-[#9c89B8] hover:bg-[#8a78a6]">
                      {interest}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="border-dashed border-gray-700 text-gray-400">
                    + Add Interest
                  </Button>
                </div>
              </div>

              <Button className="bg-[#9c89B8] hover:bg-[#8a78a6]" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card className="bg-gradient-to-br from-black to-gray-900 border-[#F0A6CA]/30">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your account settings and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-gray-300">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter your current password"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-gray-300">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-gray-300">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>

              <Button className="bg-[#F0A6CA] hover:bg-[#e095b9] text-black" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Account
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-gradient-to-br from-black to-gray-900 border-[#E7BCDE]/30">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white">Email Notifications</h4>
                    <p className="text-sm text-gray-400">Receive email updates about activity</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="email-notifications"
                      className="rounded border-gray-700 bg-gray-900"
                      defaultChecked
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white">New Post Notifications</h4>
                    <p className="text-sm text-gray-400">Get notified about new VR/AR articles</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="post-notifications"
                      className="rounded border-gray-700 bg-gray-900"
                      defaultChecked
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white">Comment Notifications</h4>
                    <p className="text-sm text-gray-400">Get notified when someone comments on your posts</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="comment-notifications"
                      className="rounded border-gray-700 bg-gray-900"
                      defaultChecked
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white">Marketing Emails</h4>
                    <p className="text-sm text-gray-400">Receive emails about new features and updates</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="marketing-emails" className="rounded border-gray-700 bg-gray-900" />
                  </div>
                </div>
              </div>

              <Button className="bg-[#E7BCDE] hover:bg-[#d6abcd] text-black" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
