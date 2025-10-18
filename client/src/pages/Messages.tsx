import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Search, Paperclip, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FileUploader } from "@/components/FileUploader";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // New message compose state
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeRecipientId, setComposeRecipientId] = useState<string>("");
  const [composeMessage, setComposeMessage] = useState("");

  // Fetch conversations
  const { data: conversations, isLoading: loadingConversations } = useQuery<Conversation[]>({
    queryKey: ["/api/messages/threads"],
  });

  const selectedConv = conversations?.find(c => c.id === selectedConversation) || null;

  // Fetch messages for selected conversation
  const { data: messages, isLoading: loadingMessages } = useQuery<Message[]>({
    queryKey: ["/api/messages", selectedConv?.otherUser.id],
    enabled: !!selectedConv,
    queryFn: async () => {
      if (!selectedConv?.otherUser.id) return [] as Message[];
      return await apiRequest(`/api/messages/${selectedConv.otherUser.id}`);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { recipientId: string; content: string; attachments: string[] }) => {
      return await apiRequest("/api/messages", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedConv?.otherUser.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/threads"] });
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

    const selectedConvLocal = conversations?.find(c => c.id === selectedConversation);
    if (!selectedConvLocal) return;

    sendMessageMutation.mutate({
      recipientId: selectedConvLocal.otherUser.id,
      content: messageInput,
      attachments: attachments.map(a => a.url),
    });
  };

  const handleSendNewMessage = () => {
    if (!composeRecipientId || !composeMessage.trim()) return;
    sendMessageMutation.mutate(
      { recipientId: composeRecipientId, content: composeMessage, attachments: [] },
      {
        onSuccess: () => {
          setComposeOpen(false);
          setComposeMessage("");
          setComposeRecipientId("");
        },
      }
    );
  };

  const filteredConversations = conversations
    ?.filter(c => c.otherUser.email.toLowerCase().includes(searchQuery.toLowerCase()))
    ?.filter(c => (filter === "unread" ? c.unreadCount > 0 : true));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-12 px-6">
        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3" data-testid="heading-messages">Messages</h1>
              <p className="text-lg opacity-90">Communicate with partners and track conversations</p>
            </div>
            <DialogTrigger asChild>
              <Button
                className="bg-yellow-500 text-black hover:bg-yellow-600"
                data-testid="button-new-message"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Compose New Message</DialogTitle>
              <DialogDescription>Select a recipient and write your message.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Recipient</label>
                <Select value={composeRecipientId} onValueChange={(v) => setComposeRecipientId(v)}>
                  <SelectTrigger data-testid="select-recipient">
                    <SelectValue placeholder="Choose a conversation" />
                  </SelectTrigger>
                  <SelectContent>
                    {(conversations ?? []).map((c) => (
                      <SelectItem key={c.otherUser.id} value={c.otherUser.id}>
                        {c.otherUser.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-[120px]"
                  data-testid="textarea-new-message"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSendNewMessage}
                  disabled={!composeRecipientId || !composeMessage.trim() || sendMessageMutation.isPending}
                  data-testid="button-send-new-message"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          {/* Conversations List */}
          <Card className="w-[360px] flex flex-col rounded-xl shadow-sm border border-border/50">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-[56px] rounded-full focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  data-testid="input-search-conversations"
                />
              </div>
              <div className="mt-3">
                <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
                  <TabsList className="grid grid-cols-2 rounded-full h-8">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                  </TabsList>
                </Tabs>
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
                      className={`w-full p-3 rounded-xl text-left transition hover:bg-muted ${
                        selectedConversation === conversation.id ? "bg-muted/50 ring-1 ring-border" : "ring-1 ring-transparent"
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
                              <Badge variant="secondary" className="ml-auto flex-shrink-0">
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
          <Card className="flex-1 flex flex-col rounded-xl shadow-sm border border-border/50">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <CardHeader className="border-b border-border/50">
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
                              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                isOwnMessage
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted ring-1 ring-border"
                              } shadow-sm`}
                            >
                              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                              {message.attachments.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {message.attachments.map((url, idx) => (
                                    <a
                                      key={idx}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs underline"
                                    >
                                      Attachment {idx + 1}
                                    </a>
                                  ))}
                                </div>
                              )}
                              <div className={`mt-1 text-[11px] opacity-70 ${isOwnMessage ? "text-primary-foreground" : "text-muted-foreground"}`}>
                                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Composer */}
                <div className="border-t border-border/50 p-4 space-y-3">
                  {showFileUpload && (
                    <FileUploader
                      onUpload={(file) => setAttachments((prev) => [...prev, file])}
                      onRemove={(url) => setAttachments((prev) => prev.filter(f => f.url !== url))}
                      className="mb-2"
                    />
                  )}
                  <div className="flex items-end gap-3">
                    <Textarea
                      placeholder="Type your message... (Enter to send, Shift+Enter for newline)"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 rounded-xl resize-none min-h-[56px] max-h-[180px] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      data-testid="textarea-message"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="h-[48px]"
                        onClick={() => setShowFileUpload((s) => !s)}
                        data-testid="button-attach"
                      >
                        <Paperclip className="h-4 w-4 mr-2" />
                        Attach
                      </Button>
                      <Button
                        className="h-[48px]"
                        onClick={handleSendMessage}
                        disabled={sendMessageMutation.isPending || (!messageInput.trim() && attachments.length === 0)}
                        data-testid="button-send"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((a) => (
                        <div key={a.url} className="h-8 px-2 rounded-md bg-muted text-xs flex items-center gap-2">
                          <span className="truncate max-w-[160px]">{a.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setAttachments((prev) => prev.filter(f => f.url !== a.url))}
                          >
                            <span className="sr-only">Remove</span>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
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
