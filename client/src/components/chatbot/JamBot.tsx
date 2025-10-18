import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Send, Mic } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function JamBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm JamBot, your AI assistant for all things manufacturing in Jamaica. I can help you with import/export procedures, certifications, cost analysis, and more. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Call real API endpoint for AI-powered responses
      const response = await apiRequest("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error("JamBot error:", error);
      toast({
        title: "Error",
        description: "Failed to get response from JamBot. Please try again.",
        variant: "destructive",
      });
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickReplies = [
    "Tell me about HACCP certification",
    "What are the import requirements?",
    "Help with cost analysis",
    "Find manufacturers for food processing",
  ];

  return (
    <div className="fixed inset-0 z-[2147483647] pointer-events-none">
      {/* Chat Bubble Button */}
      {!isOpen && (
        <div className="absolute bottom-5 right-5 pointer-events-auto" style={{ bottom: 20, right: 20 }} data-testid="container-jambot-button">
          <Button
            size="icon"
            className="h-16 w-16 rounded-full shadow-lg transition-all duration-200 ease-out hover:scale-110 hover:-translate-y-1 hover:shadow-xl motion-safe:hover:animate-bounce hover-elevate active-elevate-2"
            onClick={() => setIsOpen(true)}
            data-testid="button-jambot-open"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive rounded-full flex items-center justify-center text-xs text-destructive-foreground">
              1
            </span>
          </Button>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="absolute bottom-5 right-5 pointer-events-auto" style={{ bottom: 20, right: 20 }} data-testid="container-jambot-panel">
          <Card className="w-[400px] h-[600px] shadow-2xl flex flex-col" data-testid="panel-jambot">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-green-600 text-white">JB</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">JamBot</CardTitle>
                <p className="text-xs text-muted-foreground">AI Manufacturing Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover-elevate"
              data-testid="button-jambot-close"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                data-testid={`chatbot-message-${message.role}`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-green-600 text-white">JB</AvatarFallback>
                  </Avatar>
                )}

                <div className={`flex flex-col gap-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground px-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-green-600 text-white">JB</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="text-xs text-muted-foreground mb-2">Quick questions:</div>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs hover-elevate"
                    onClick={() => setInput(reply)}
                    data-testid={`button-quick-reply-${idx}`}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="flex-shrink-0 hover-elevate"
                data-testid="button-voice-input"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about manufacturing..."
                className="resize-none min-h-[50px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                data-testid="textarea-chatbot-input"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="flex-shrink-0 hover-elevate active-elevate-2"
                data-testid="button-send-chatbot"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          </Card>
        </div>
      )}
    </div>
  );
}
