"use client"

import React, { useState, useEffect, use } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/blocks/sidebar"

import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  User,
  ChevronsUpDown,
  MessageSquare,
  Clock,
} from "lucide-react"

import ChatMessageListDemo from "@/components/ChatUi"
import { negotiationAgentApi } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"

interface NegotiationSession {
  session_id: string
  brand_name: string
  influencer_name: string
  brand_id: string
  inf_id: string
  status: string
  created_at: string
  updated_at: string
}

const items = [
  { title: "Home", url: "#", icon: Home },
//   { title: "Inbox", url: "#", icon: Inbox },
//   { title: "Calendar", url: "#", icon: Calendar },
//   { title: "Search", url: "#", icon: Search },
//   { title: "Settings", url: "#", icon: Settings },
]

export default function SidebarDemo() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
        {/* Top Nav (fixed) */}
        <header className="fixed top-0 left-0 right-0 z-30 h-16 px-4 flex items-center justify-between border-b bg-white shadow-sm">
          <div className="text-xl font-bold text-blue-600">InfluencerFlow</div>
          <div className="flex items-center gap-2">
            <button className="text-sm text-gray-600 hover:underline">Login</button>
            <button className="ml-2 px-3 py-1 rounded bg-black text-white text-sm">
              Sign Up
            </button>
          </div>
        </header>

        {/* Body: sidebar + chat (side-by-side) */}
        <div className="flex flex-row flex-1 pt-16 overflow-hidden">
          <SidebarSection 
            selectedSessionId={selectedSessionId}
            onSessionSelect={setSelectedSessionId}
          />
          <ChatSection sessionId={selectedSessionId} />
        </div>
      </div>
    </SidebarProvider>
  )
}

interface SidebarSectionProps {
  selectedSessionId: string | null
  onSessionSelect: (sessionId: string) => void
}

function SidebarSection({ selectedSessionId, onSessionSelect }: SidebarSectionProps) {
  const { state, toggleSidebar } = useSidebar()
  let { user } = useAuth()
  const [sessions, setSessions] = useState<NegotiationSession[]>([])
  const [loading, setLoading] = useState(false)
  if (user) {
    user.id="38579c1e-9aaa-4fa7-8882-5429c9d5c221";
    user.role="brand"; // For testing purposes, set user role to 'brand'
  }else {  user= {
    id: "38579c1e-9aaa-4fa7-8882-5429c9d5c221",
    role: "brand",
    full_name: "Test User",
    email: ""
}
  }
  console.log("User:", user);
  useEffect(() => {
    if (user?.id && user?.role) {
      loadUserSessions()
    }
  }, [user?.id, user?.role])

  const loadUserSessions = async () => {
    if (!user?.id || !user?.role) return
    
    setLoading(true)
    try {
      let userSessions: NegotiationSession[] = []
      
      if (user.role === 'brand') {
        // For brands, fetch sessions by brand ID (using user.id as brand_id)
        userSessions = await negotiationAgentApi.getBrandSessions(user.id)
      } else if (user.role === 'influencer') {
        // For influencers, fetch sessions by influencer ID (using user.id as inf_id)
        userSessions = await negotiationAgentApi.getInfluencerSessions(user.id)
      } else {
        // For other roles or admin, get all sessions related to the user
        userSessions = await negotiationAgentApi.getUserSessions(user.id)
      }
    //   userSessions.push(
    //     {
    //       session_id: "8f78e162-5816-45c4-8023-76fc6a5ebe49",
    //       brand_name: "Tech Innovations Co",
    //       influencer_name: "Alex TechReviewer",
    //       brand_id: user.id,
    //       inf_id: "65aa32cc-3514-429c-bc89-fcf0439d2d52",
    //       status: "draft",
    //       created_at: new Date().toISOString(),
    //       updated_at: new Date().toISOString(),
    //     }
    //   )
      setSessions(userSessions)
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  // If `collapsed`, use 4rem = w-16. Otherwise 20rem = w-80.
  const widthClass = state === "collapsed" ? "w-16" : "w-80"

  return (
    <div
      // 1) w-16 or w-80 depending on `state`
      // 2) flex-shrink-0 so it never flex-narrows below that width
      // 3) transition-[width] duration-300 for smooth animation
      className={`${widthClass} flex-shrink-0 relative transition-[width] duration-300`}
    >
      {/* 
        Sidebar “fills” the wrapper. We do NOT set width on <Sidebar>,
        because the wrapper’s w-16/w-80 already fixes it.
      */}
      <Sidebar
        variant="sidebar"
        collapsible="offcanvas"
        className="h-full"
      >
        <SidebarContent>
          {/* Navigation Items */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href="#" className="flex items-center gap-2">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Negotiation Sessions */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {user?.role === 'brand' ? 'My Brand Negotiations' : 
               user?.role === 'influencer' ? 'My Collaborations' : 
               'Negotiation Sessions'}
              {loading && <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-500"></div>}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sessions.length === 0 && !loading ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    {user?.role === 'brand' 
                      ? 'No brand negotiations yet' 
                      : user?.role === 'influencer' 
                      ? 'No collaborations yet' 
                      : 'No sessions yet'}
                  </div>
                ) : (
                  sessions.map((session) => (
                    <SidebarMenuItem key={session.session_id}>
                      <SidebarMenuButton 
                        className={`flex flex-col items-start gap-1 h-auto p-3 ${
                          selectedSessionId === session.session_id ? 'bg-accent' : ''
                        }`}
                        onClick={() => onSessionSelect(session.session_id)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium text-sm truncate">
                            {session.brand_name}
                          </span>
                          <Badge 
                            variant={session.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {session.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground truncate w-full">
                          ↔ {session.influencer_name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(session.updated_at).toLocaleDateString()}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <SidebarMenuButton className="w-full justify-between gap-3 h-12">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 rounded-md" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {user?.full_name || user?.email || 'User'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.role || 'No role'} • {user?.email}
                  </span>
                </div>
              </div>
              <ChevronsUpDown className="h-5 w-5 rounded-md" />
            </SidebarMenuButton>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>

      {/* 
        Toggle button “peeks out” to the right of sidebar:
        - absolute top-4 positions it down 1 rem from top of wrapper
        - right-[-1.5rem] moves it 1.5 rem outside the right edge
      */}
      <SidebarTrigger
        onClick={toggleSidebar}
        className="absolute top-4 z-10 right-[-0rem] h-9 w-9 border rounded-md bg-white shadow"
      />
    </div>
  )
}

interface ChatSectionProps {
  sessionId: string | null
}

function ChatSection({ sessionId }: ChatSectionProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b">
        <h1 className="text-lg font-semibold">
          {sessionId ? 'Negotiation Chat' : 'AI Chat Assistant'}
        </h1>
        {sessionId && (
          <Badge variant="outline" className="text-xs">
            Session: {sessionId.slice(0, 8)}...
          </Badge>
        )}
      </div>

      {/* Chat content */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 lg:p-6">
        <ChatMessageListDemo sessionId={sessionId} />
      </div>
    </div>
  )
}
