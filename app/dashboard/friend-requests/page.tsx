"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from "@/components/ui/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import useAxiosInstance from "@/hooks/useAxiosInstance/useAxiosInstance";

const FriendRequestsPage = () => {
  const { fetchData } = useAxiosInstance();
  const { toast } = useToast();

  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Fetch incoming and sent friend requests
  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        const response = await fetchData("/friends/incoming");
        setIncomingRequests(response);
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch incoming requests", variant: "destructive" });
      }
    };

    const fetchSentRequests = async () => {
      try {
        const response = await fetchData("/friends/sent");
        setSentRequests(response);
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch sent requests", variant: "destructive" });
      }
    };

    fetchIncomingRequests();
    fetchSentRequests();
  }, [fetchData]);

  // Fetch users when search query changes
  useEffect(() => {
    if (searchQuery.length > 0) {
      const searchUsers = async () => {
        try {
          const response = await fetchData(`/users/search?query=${searchQuery}`);
          setSearchResults(response);
        } catch (error) {
          toast({ title: "Error", description: "Failed to search users", variant: "destructive" });
        }
      };

      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, fetchData]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await fetchData(`/friends/${requestId}`, { method: "PUT" });
      setIncomingRequests((prev) => prev.filter((req) => req._id !== requestId));
      toast({ title: "Friend request accepted", description: "You are now friends!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to accept the request", variant: "destructive" });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await fetchData(`/friends/${requestId}`, { method: "DELETE" });
      setIncomingRequests((prev) => prev.filter((req) => req._id !== requestId));
      toast({ title: "Friend request rejected", description: "Request has been declined" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject the request", variant: "destructive" });
    }
  };

  const handleSendFriendRequest = async (userId: string) => {
    try {
      await fetchData("/friends", { method: "POST", data: { from: "userId", to: userId } });
      toast({ title: "Friend request sent", description: "Your friend request has been sent" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to send the request", variant: "destructive" });
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Friend Requests</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Button onClick={() => handleSendFriendRequest("selectedUserId")}>Send Friend Request</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="incoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="incoming" className="flex items-center gap-2">
                Incoming
                {incomingRequests.length > 0 && (
                  <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs">{incomingRequests.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
            </TabsList>

            <TabsContent value="incoming" className="mt-6">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="space-y-4">
                  {incomingRequests.length === 0 && <div className="text-center py-8 text-muted-foreground">No incoming requests</div>}
                  {incomingRequests.map((request) => (
                    <Card key={request._id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{request.name.split(" ")[0][0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{request.name}</h3>
                            <p className="text-sm text-muted-foreground">{request.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => handleAcceptRequest(request._id)} className="bg-green-600 hover:bg-green-700">
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleRejectRequest(request._id)}>
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="sent" className="mt-6">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="space-y-4">
                  {sentRequests.length === 0 && <div className="text-center py-8 text-muted-foreground">No sent friend requests</div>}
                  {sentRequests.map((request) => (
                    <Card key={request._id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{request.name.split(" ")[0][0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{request.name}</h3>
                            <p className="text-sm text-muted-foreground">{request.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Pending</Badge>
                          <Button variant="outline" size="sm" onClick={() => handleCancelRequest(request._id)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendRequestsPage;
