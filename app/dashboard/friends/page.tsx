"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAxiosInstance } from "@/hooks/useAxiosInstance/useAxiosInstance"
import { MessageCircle, Phone, Search, Video } from "lucide-react"
import { useEffect, useState } from "react"

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [friends, setFriends] = useState([])
  const axiosInstance = useAxiosInstance()

  // Fetch friends data from API
  useEffect(() => {
    async function fetchFriends() {
      try {
        const response = await axiosInstance.get("/friends/myFrineds")
        setFriends(response.data)
      } catch (error) {
        console.error("Error fetching friends:", error)
      }
    }

    fetchFriends()
  }, [])

  const filteredFriends = friends.filter(
    (friend) =>
      friend?.friendId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend?.friendId?.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Friends</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search friends by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="grid gap-4">
              {filteredFriends.map((friend) => (
                <Card key={friend?._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={friend?.friendId?.image || "/placeholder.svg"} />
                          <AvatarFallback>
                            {friend?.friendId?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {friend?.friendId?.online && (
                          <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{friend?.friendId?.name}</h3>
                        <p className="text-sm text-muted-foreground">{friend?.friendId?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={friend?.online ? "default" : "secondary"}>{friend?.lastSeen}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
