// ChatMessageListDemo.tsx
"use client"

import { useState, FormEvent, useEffect } from "react"
import { Paperclip, Mic, CornerDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble"
import { ChatMessageList } from "@/components/ui/chat-message-list"
import { ChatInput } from "@/components/ui/chat-input"
import { negotiationAgentApi } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

interface Message {
  id: number
  content: string
  sender: "user" | "ai"
  timestamp?: string
}

interface ChatMessageListDemoProps {
  sessionId?: string | null
}

export default function ChatMessageListDemo({ sessionId }: ChatMessageListDemoProps) {
  let { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionLoading, setSessionLoading] = useState(false)
  if(!user){
    user= {
    id: "123456",
    role: "brand",
    full_name: "Test User",
    email: ""}
  }
  // Load session data when sessionId changes
  useEffect(() => {
    if (sessionId) {
      loadSessionData()
    } else {
      // Show default welcome messages when no session is selected
      setMessages([
        {
          id: 1,
          content: "Hello! I'm your negotiation assistant. Select a session from the sidebar to continue a conversation, or I can help you start a new negotiation.",
          sender: "ai",
        },
      ])
    }
  }, [sessionId])

  const loadSessionData = async () => {
    if (!sessionId) return
    
    setSessionLoading(true)
    try {
      const sessionData = await negotiationAgentApi.getSessionChat(sessionId)
      console.log('Loaded session data:', sessionData)
      if (sessionData && sessionData.messages && sessionData.messages.length > 0) {
        const formattedMessages = sessionData.messages.map((msg: any, index: number) => ({
          id: index + 1,
          content: msg.content,
          sender: msg.message_type === 'user' ? 'user' : 'ai' as 'user' | 'ai',
          timestamp: msg.timestamp
        }))
        console.log('Formatted messages:', formattedMessages)
        setMessages(formattedMessages)
      } else {
        // If no messages, show a default message
        setMessages([{
          id: 1,
          content: "This session is ready. Send a message to continue the negotiation.",
          sender: "ai",
        }])
      }
    } catch (error) {
      console.error('Error loading session:', error)
      setMessages([{
        id: 1,
        content: "Sorry, I couldn't load this session. Please try selecting another session.",
        sender: "ai",
      }])
    } finally {
      setSessionLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message immediately
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      if (sessionId && user?.id) {
        // Use negotiation agent API for real sessions
        const response = await negotiationAgentApi.continueConversation(
          sessionId,
          input,
          user.id
        )
        
        const aiMessage: Message = {
          id: messages.length + 2,
          content: response.agent_response,
          sender: "ai",
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        // Default behavior for demo/no session
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              content: "This is a demo response. Please select a session from the sidebar to start a real negotiation conversation.",
              sender: "ai",
            },
          ])
          setIsLoading(false)
        }, 1000)
        return
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          content: "Sorry, there was an error sending your message. Please try again.",
          sender: "ai",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAttachFile = () => {
    // just a placeholder
  }

  const handleMicrophoneClick = () => {
    // just a placeholder
  }

  return (
    <div className="flex-1 border bg-background rounded-lg flex flex-col overflow-hidden">
      {sessionLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading session...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Messages area */}
          <div className="flex-1 overflow-hidden">
            <ChatMessageList>
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  variant={message.sender === "user" ? "sent" : "received"}
                >
                  <ChatBubbleAvatar
                    className="h-8 w-8 shrink-0"
                    src={
                      message.sender === "user"
                        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                    }
                    fallback={message.sender === "user" ? "US" : "AI"}
                  />
                  <ChatBubbleMessage
                    variant={message.sender === "user" ? "sent" : "received"}
                  >
                    {message.content}
                    {message.timestamp && (
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    )}
                  </ChatBubbleMessage>
                </ChatBubble>
              ))}

              {isLoading && (
                <ChatBubble variant="received">
                  <ChatBubbleAvatar
                    className="h-8 w-8 shrink-0"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                    fallback="AI"
                  />
                  <ChatBubbleMessage isLoading />
                </ChatBubble>
              )}
            </ChatMessageList>
          </div>

          {/* Input area */}
          <div className="p-4 border-t">
            <form
              onSubmit={handleSubmit}
              className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
            >
              <ChatInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={sessionId ? "Type your negotiation message..." : "Select a session to start chatting..."}
                className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                disabled={isLoading}
              />
              <div className="flex items-center p-3 pt-0 justify-between">
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={handleAttachFile}
                    disabled={!sessionId}
                  >
                    <Paperclip className="size-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={handleMicrophoneClick}
                    disabled={!sessionId}
                  >
                    <Mic className="size-4" />
                  </Button>
                </div>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="ml-auto gap-1.5"
                  disabled={isLoading || !input.trim()}
                >
                  Send Message
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
