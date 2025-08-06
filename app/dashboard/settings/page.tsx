"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Camera, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [notifications, setNotifications] = useState({
    messages: true,
    friendRequests: true,
    groupInvites: true,
    emailNotifications: false,
  })
  const { toast } = useToast()
  const router = useRouter()

  const handleProfileUpdate = () => {
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    })
  }

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="text-lg">JD</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-transparent"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h3 className="font-medium">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">Click the camera icon to upload a new picture</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Change Password</h4>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={profile.currentPassword}
                    onChange={(e) => setProfile((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={profile.newPassword}
                    onChange={(e) => setProfile((prev) => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={profile.confirmPassword}
                    onChange={(e) => setProfile((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleProfileUpdate}>Update Profile</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="messages">Message Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
              </div>
              <Switch
                id="messages"
                checked={notifications.messages}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, messages: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="friendRequests">Friend Request Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when you receive friend requests</p>
              </div>
              <Switch
                id="friendRequests"
                checked={notifications.friendRequests}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, friendRequests: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="groupInvites">Group Invite Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when you're invited to groups</p>
              </div>
              <Switch
                id="groupInvites"
                checked={notifications.groupInvites}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, groupInvites: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailNotifications: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
