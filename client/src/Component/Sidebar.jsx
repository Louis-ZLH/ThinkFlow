import Tooltip from '@mui/material/Tooltip';
// Menu items.
import * as React from "react"
import { useNavigate } from 'react-router-dom';
import { Hand, PanelLeft } from "lucide-react";
import { Button, IconButton } from "@mui/material";
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import { MoreHorizontal } from "lucide-react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  SidebarMenuAction
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// This is sample data.

export function AppSidebar(props) {
    const { id } = useParams(); 
    const listData = props.listData;
    const navigate = useNavigate();
  return (
    <Sidebar >
      <SidebarHeader>
        <div className="flex justify-between items-center w-70">
        <SidebarTrigger />
            <Tooltip arrow title="New Chat">
                <IconButton onClick={()=>{navigate('/chat')}}>
                    <MapsUgcOutlinedIcon sx={{ color: 'white' }} />
                </IconButton>
            </Tooltip>
        </div>
      </SidebarHeader>
      <SidebarContent >
        {/* We create a SidebarGroup for each parent. */}
        {listData.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-md font-semibold">{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="text-lg h-full px-4 py-2 text-base font-medium" isActive={'/chat/'+id===item.url?true:false}
                      onClick = {()=>{}}
                    >
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                    {'/chat/'+id===item.url&&
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                            <MoreHorizontal />
                        </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem>
                            <Button onClick={async ()=>{
                              await props.deleteConversation(id);
                              props.updateSidebar(id);}}>Delete Project</Button>
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
