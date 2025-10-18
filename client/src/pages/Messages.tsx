import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Search, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FileUploader } from "@/components/FileUploader";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  id: number;
  otherUser: {
    id: string;
    email: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    isRead: boolean;
  } | null;
  unreadCount: number;
}

interface Message {
  id: number;
  senderId: string;
  content: string;
  attachments: string[];
  createdAt: string;
  isRead: boolean;
}

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [attachments, setAttachments] = useState<Array<{name: string, url: string}>>([]);
  const { toast } = useToast();

  // Fetch conversations
  const { data: conversations, isLoading: loadingConversations } = useQuery<Conversation[]>({
    queryKey: ["/api/messages/conversations"],
  });

  // Fetch messages for selected conversation
  const { data: messages, isLoading: loadingMessages } = useQuery<Message[]>({
    queryKey: ["/api/messages", selectedConversation],
    enabled: selectedConversation !== null,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { recipientId: string; content: string; attachments: string[] }) => {
      return await apiRequest("/api/messages", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations"] });
      setMessageInput("");
      setAttachments([]);
      setShowFileUpload(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!messageInput.trim() && attachments.length === 0) return;
    if (!selectedConversation) return;

    const selectedConv = conversations?.find(c => c.id === selectedConversation);
    if (!selectedConv) return;

    sendMessageMutation.mutate({
      recipientId: selectedConv.otherUser.id,
      content: messageInput,
      attachments: attachments.map(a => a.url),
    });
  };

  const filteredConversations = conversations?.filter(c =>
    c.otherUser.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations?.find(c => c.id === selectedConversation);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3" data-testid="heading-messages">Messages</h1>
          <p className="text-lg opacity-90">Communicate with partners and track conversations</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          {/* Conversations List */}
          <Card className="w-80 flex flex-col">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-conversations"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {loadingConversations && (
                    <>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-3 space-y-3">
                          <div className="flex items-start gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-full" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {!loadingConversations && filteredConversations?.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">No conversations yet</div>
                  )}
                  {!loadingConversations && filteredConversations?.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`w-full p-3 rounded-lg text-left transition-colors hover-elevate ${
                        selectedConversation === conversation.id ? "bg-accent" : ""
                      }`}
                      data-testid={`button-conversation-${conversation.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {conversation.otherUser.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-medium truncate">{conversation.otherUser.email}</div>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="default" className="ml-auto flex-shrink-0">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          {conversation.lastMessage && (
                            <>
                              <div className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessage.content}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                                  addSuffix: true,
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {selectedConv?.otherUser.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedConv?.otherUser.email}</CardTitle>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {loadingMessages && (
                        <>
                          {[1, 2, 3].map((i) => (
                            <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                              <div className="max-w-[70%] space-y-2">
                                <Skeleton className="h-16 w-64" />
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      {!loadingMessages && messages?.map((message) => {
                        const isOwnMessage = message.senderId !== selectedConv?.otherUser.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                            data-testid={`message-${message.id}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isOwnMessage
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <div className="text-sm">{message.content}</div>
                              {message.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {message.attachments.map((url, idx) => (
                                    <a
                                      key={idx}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs underline block"
                                    >
                                      Attachment {idx + 1}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Composer */}
                <div className="border-t p-4 space-y-3">
                  {showFileUpload && (
                    <FileUploader
                      onUpload={(file) => setAttachments((prev) => [...prev, file])}
                      onRemove={(url) => setAttachments((prev) => prev.filter(f => f.url !== url))}
                      className="mb-2"
                    />
                  )}
                  <div className="flex items-end gap-3">
                    <Textarea
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1"
                      data-testid="textarea-message"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowFileUpload((s) => !s)}
                        data-testid="button-attach"
                      >
                        <Paperclip className="h-4 w-4 mr-2" />
                        Attach
                      </Button>
                      <Button onClick={handleSendMessage} data-testid="button-send">
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                  {attachments.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {attachments.length} attachment{attachments.length > 1 ? "s" : ""} ready to send
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground p-6">
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
