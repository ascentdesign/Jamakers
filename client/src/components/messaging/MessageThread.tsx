import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Paperclip } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { Message, User } from "@shared/schema";

interface MessageThreadProps {
  messages: (Message & { sender?: User; recipient?: User })[];
  otherUser: User;
  onSendMessage: (content: string) => void;
}

export function MessageThread({ messages, otherUser, onSendMessage }: MessageThreadProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage("");
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (u?: User) => {
    if (!u) return "?";
    if (u.firstName && u.lastName) {
      return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
    }
    return u.email?.[0]?.toUpperCase() || "?";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="message-thread">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === user?.id;
          const displayUser = isOwnMessage ? user : otherUser;

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
              data-testid={`message-${message.id}`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={displayUser?.profileImageUrl || undefined} className="object-cover" />
                <AvatarFallback className="text-xs">{getInitials(displayUser)}</AvatarFallback>
              </Avatar>

              <div className={`flex flex-col gap-1 max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                  <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {message.readAt && isOwnMessage && (
                    <span className="text-primary">• Read</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0 hover-elevate"
            data-testid="button-attach-file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="resize-none min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            data-testid="textarea-message"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
            size="icon"
            className="flex-shrink-0 hover-elevate active-elevate-2"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </div>
  );
}
