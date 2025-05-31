import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from "../Component/Sidebar";
import { Separator } from "@/components/ui/separator"
import axios from 'axios';
import { SidebarProvider,SidebarTrigger,SidebarInset } from "@/components/ui/sidebar";
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import { ChatPart } from "@/Component/ChatPart";
import { AwardIcon } from "lucide-react";
import { useParams } from "react-router-dom";

function ChatPage(){
  const baseURL = import.meta.env.VITE_API_URL;
  const {id} = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [userId,setUserID] = useState();
  const [listData,setListData] = useState(
    [
    {
      title: "Getting Started",
      items: [
        {
          title: "New Chat",
          url: "/chat",
        }
      ]
    }
  ]
  );
  function updateSidebar(id) {
    if(listData.length<2) return;
    for(let i=listData.length-1;i>=1;i--)
    {
      let item = listData[i];
      let index = item.items.findIndex(i=>i.url==="/chat/"+id);
      if(index !== -1)
      {
        setListData((pre)=>{
          const newList = [...pre];
          const targetGroup = { ...newList[i] };
          targetGroup.items = [...targetGroup.items];
          targetGroup.items.splice(index, 1);
          if(targetGroup.items.length===0)
          {
            newList.splice(i,1);
            return newList;
          }
          newList[i] = targetGroup;
          return newList;
        });
        break;
      }
    }    
  }

  useEffect(() => {
    if(listData.length>=2) return; 
    const token = localStorage.getItem('token');
    if (!token) {
     console.log("token not exist");
      navigate('/sign-in');
      return;
    }
    const VerifyAccount= async ()=>{
      try{
      const res = await axios.get(baseURL+'/api/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
      let thisPageEmail = res.data.email;
      let thisPageUserId = res.data.userId;
      setEmail(thisPageEmail);
      setUserID(thisPageUserId);
      const conversationList = res.data.conversationList || [];
      const now = new Date();
      const today = now.toDateString();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const grouped = {
        "Today": [],
        "Previous 7 Days": [],
        "Earlier": []
      };
      conversationList
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // 按时间降序
        .forEach(conv => {
          let created = new Date(conv.created_at);
          created = new Date(created.getTime() + 8 * 60 * 60 * 1000);//北京时间
          const item = { title: conv.title, url: `/chat/${conv.id}` };

          if (created.toDateString() === today) {
            grouped["Today"].push(item);
          } else if (created > sevenDaysAgo) {
            grouped["Previous 7 Days"].push(item);
          } else {
            grouped["Earlier"].push(item);
          }
        });

      const result = [];
      if (grouped["Today"].length) {
        result.push({ title: "Today", items: grouped["Today"] });
      }
      if (grouped["Previous 7 Days"].length) {
        result.push({ title: "Previous 7 Days", items: grouped["Previous 7 Days"] });
      }
      if (grouped["Earlier"].length) {
        result.push({ title: "Earlier", items: grouped["Earlier"] });
      }

      setListData(pre=>[{
      title: "Getting Started",
      items: [
        {
          title: "New Chat",
          url: "/chat",
        }
      ]
    },...result]);
      
      }catch(err){
        navigate('/sign-in'); // 或 navigate('/home')
      }
    }
      VerifyAccount();
  }, [navigate]);
  async function deleteConversation(conversationId) {
    try {
    const token = localStorage.getItem('token');
    if (!token) {
    navigate('/sign-in');
    return;
    }
    const res = await axios.delete(baseURL+`/api/deleteConversation/${conversationId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
          });
    navigate('/chat');
  } catch (error) {
    console.error('删除失败', error);
  }
  }

  return (
    <div style={{background:"red"}}>
    <SidebarProvider style={{
    "--sidebar-width": "20rem",
    "--sidebar-width-mobile": "20rem",
  }}>
    <AppSidebar listData={listData} deleteConversation={deleteConversation} updateSidebar={updateSidebar}/>
    <SidebarInset>
      <ChatPart email = {email} user_id = {userId} updateList={setListData}/>
    </SidebarInset>
    </SidebarProvider>
    </div>
  );
}

export default ChatPage;