"use client";
import { SidebarDemo } from "@/components/SideBar";
import React from "react";

export default function AgentChats(){
    return(
        <div className="pt-16"> {/* Account for fixed navbar */}
            <SidebarDemo />
        </div>
    )
}