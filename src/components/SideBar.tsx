"use client"

import React from "react"
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
} from "lucide-react"

import ChatMessageListDemo from "@/components/ChatUi"

const items = [
  { title: "Home", url: "#", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
]

export default function SidebarDemo() {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
        {/* =======================
            1) Top Nav (fixed)
        ======================= */}
        <header className="fixed top-0 left-0 right-0 z-30 h-16 px-4 flex items-center justify-between border-b bg-white shadow-sm">
          <div className="text-xl font-bold text-blue-600">InfluencerFlow</div>
          <div className="flex items-center gap-2">
            <button className="text-sm text-gray-600 hover:underline">Login</button>
            <button className="ml-2 px-3 py-1 rounded bg-black text-white text-sm">
              Sign Up
            </button>
          </div>
        </header>

        {/* =======================
            2) Body: sidebar + chat (side-by-side)
            - `flex flex-row flex-1` ensures they never wrap
            - `pt-16` pushes content below the fixed header
        ======================= */}
        <div className="flex flex-row flex-1 pt-16 overflow-hidden">
          <SidebarSection />
          <ChatSection />
        </div>
      </div>
    </SidebarProvider>
  )
}

function SidebarSection() {
  const { state, toggleSidebar } = useSidebar()

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
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
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
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <SidebarMenuButton className="w-full justify-between gap-3 h-12">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 rounded-md" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">John Doe</span>
                  <span className="text-xs text-muted-foreground">
                    john@example.com
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
        className="absolute top-4 right-[-0rem] h-9 w-9 border rounded-md bg-white shadow"
      />
    </div>
  )
}

function ChatSection() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b">
        <h1 className="text-lg font-semibold">AI Chat Assistant</h1>
      </div>

      {/* Chat content */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 lg:p-6">
        <ChatMessageListDemo />
      </div>
    </div>
  )
}
