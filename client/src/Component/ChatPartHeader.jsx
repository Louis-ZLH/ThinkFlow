import React from "react";
import { SidebarProvider,SidebarTrigger,SidebarInset } from "@/components/ui/sidebar";
import { MyProfile } from "./Myprofile";
export function ChatPartHeader(props){
    return (<header className="flex items-center justify-between sticky top-0 bg-neutral-800 border-b border-white/10 h-16 shrink-0 border-b border-white/10 px-4">
  {/* 左边区域 */}
  <div className="flex items-center gap-2">
    <SidebarTrigger className="-ml-1 text-white" />
  </div>

  {/* 右边区域 */}
  <div className="text-white">
    <MyProfile email = {props.email}/>
  </div>
</header>)
}
