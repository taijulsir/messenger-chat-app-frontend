"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, MessageCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

const groups = [
  {
    id: 1,
    name: "Work Team",
    description: "Daily work discussions and updates",
    members: 8,
    lastMessage: "Meeting at 3 PM today",
    timestamp: "10 min ago",
    avatar: "/placeholder.svg?height=40&width=40",
    unread: 3,
  },
  {
    id: 2,
    name: "Family",
    description: "Family group chat",
    members: 5,
    lastMessage: "Don't forget about dinner on Sunday!",
    timestamp: "2h ago",
    avatar: "/placeholder.svg?height=40&width=40",
    unread: 0,
  },
  {
    id: 3,
    name: "Book Club",
    description: "Monthly book discussions",
    members: 12,
    lastMessage: "What did everyone think of chapter 5?",
    timestamp: "1d ago",
    avatar: "/placeholder.svg?height=40&width=40",
    unread: 1,
  },
  {
    id: 4,
    name: "Gaming Squad",
    description: "Gaming sessions and tournaments",
    members: 6,
    lastMessage: "Anyone up for a game tonight?",
    timestamp: "3d ago",
    avatar: "/placeholder.svg?height=40&width=40",
    unread: 0,
  },
]

export default function GroupsPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Groups</CardTitle>
            <Link href="/dashboard/groups/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="grid gap-4">
              {groups.map((group) => (
                <Card key={group.id} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={group.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          <Users className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{group.name}</h3>
                          {group.unread > 0 && (
                            <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                              {group.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {group.members} members
                          </div>
                          <div className="text-sm text-muted-foreground">{group.timestamp}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button variant="ghost" size="icon">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Last message:</span> {group.lastMessage}
                    </p>
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
