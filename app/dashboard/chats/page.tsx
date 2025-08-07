"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Smile, Paperclip } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAxiosInstance } from "@/hooks/useAxiosInstance/useAxiosInstance"
import { useAuth } from "@/contexts/auth-context"
import socket from "@/utils/sockets"

const ChatsPage = () => {
  const axiosInstance = useAxiosInstance();
  const { toast } = useToast();
  const { user } = useAuth();

  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState<string>("");

  // Fetch the user's friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axiosInstance.get("/friends/myFrineds");
        setFriends(response.data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch friends", variant: "destructive" });
      }
    };

    fetchFriends();
  }, []);

  // Fetch the messages when a friend is selected
  useEffect(() => {
    if (selectedFriend) {
      const fetchMessages = async () => {
        try {
          const response = await axiosInstance.get(`/messages/${selectedFriend._id}`);
          setMessages(response.data);
        } catch (error) {
          toast({ title: "Error", description: "Failed to fetch messages", variant: "destructive" });
        }
      };

      fetchMessages();
    }
  }, [selectedFriend]);

  // Register user with socket and listen for incoming messages and typing events
  useEffect(() => {
    if (user) {
      // Emit the user's token to register with the server
      socket.emit('register', user._id);

      // Listen for incoming messages
      socket.on('receive_message', (messageData) => {
        setMessages((prevMessages) => [...prevMessages, messageData]);
      });

      // Listen for typing indicator
      socket.on('typing', (data) => {
        setTypingIndicator(`${data.name} is typing...`);
      });

      return () => {
        // Cleanup socket listeners when component unmounts
        socket.off('receive_message');
        socket.off('typing');
      };
    }
  }, [user]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedFriend) {
      const messageData = {
        from: user._id,
        to: selectedFriend._id,
        content: newMessage,
      };

      // Emit the message to the server
      socket.emit('send_message', messageData);

      // Update the local messages immediately
      setMessages((prev) => [...(prev || []), {
        from: {
          _id: user._id,
          name: user.name,
          image: user.image,
          online: true,
        },
        to: {
          _id: selectedFriend._id,
          name: selectedFriend.name,
          image: selectedFriend.image,
          online: true,
        },
        content: newMessage,
        timestamp: Date.now(),

      }]);

      // Clear the input field
      setNewMessage("");
      // toast({ title: "Message sent", description: "Your message has been sent" });
    }
  };

  // Emit typing event to the server
  const handleTyping = () => {
    if (newMessage.trim()) {
      socket.emit('typing', { name: user.name });
    } else {
      setTypingIndicator("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Panel - Conversations (Friends) */}
      <div className="w-80 border-r bg-background">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-3">Chats</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-2">
            {friends?.map((friend) => (
              <Card
                key={friend._id}
                className="p-3 mb-2 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => setSelectedFriend(friend?.friendId)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={friend?.friendId?.image || "/placeholder.svg"} />
                    <AvatarFallback>
                      {friend?.friendId?.name.split(" ")[0][0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{friend?.friendId?.name}</h3>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Chat View */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {
          selectedFriend &&
          <div className="p-4 border-b bg-background">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedFriend?.image || "/placeholder.svg"} />
                <AvatarFallback>
                  {selectedFriend?.name?.split(" ")[0][0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedFriend?.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedFriend?.online ? "Online" : "Offline"}</p>
                <p className="text-xs text-muted-foreground">{typingIndicator}</p>
              </div>
            </div>
          </div>

        }
        {/* Messages */}
        <ScrollArea className="flex-1 p-4 overflow-scroll">
          <div className="space-y-4">
            {messages?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground flex items-center justify-center h-[90vh]">
                <p className="text-2xl font-bold">Select a friend to start chatting</p>
              </div>
            ) : (
              messages?.length > 0 &&
              messages?.map((message, index) => (
                <div key={index} className={message.from._id === user._id ? "flex-row-reverse" : ""}>
                  <div className={`flex gap-3 ${message.from._id === user._id ? "justify-end" : "justify-start"}`}>
                    {message.from._id !== user._id && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedFriend?.image || "/placeholder.svg"} />
                        <AvatarFallback>
                          {selectedFriend?.name.split(" ")[0][0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      {/* <div className={message.from === user._id ? "bg-blue-500 text-white" : "bg-muted px-4 py-2 rounded-lg"}> */}
                      <div className="bg-muted px-4 py-2 rounded-lg">
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {message?.timestamp ? new Date(message?.timestamp)?.toLocaleString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }): ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        {
          selectedFriend &&
          <div className="p-4 border-t bg-background">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="pr-10"
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default ChatsPage;
