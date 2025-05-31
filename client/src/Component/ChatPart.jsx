import React, { useEffect, useState, useRef } from "react";
import { SidebarProvider,SidebarTrigger,SidebarInset } from "@/components/ui/sidebar";
import { ChatPartHeader } from "./ChatPartHeader";
import { ChatFooter } from "./ChatPartFooter";
import { ChatBody } from "./ChatPartBody";
import { useParams,useLocation } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export function ChatPart(props){
    const baseURL = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const location = useLocation();
    const { isNewChat } = location.state || false;
    const [isResponding,setIsResponding] = useState(false);
    const [output, setOutput] = useState('');
    const abortControllerRef = useRef(null);
    const navigate = useNavigate();
    const markdownText = `
你好！� 我是你的 AI 助手，很高兴为你服务！✨

以下是一些使用 Markdown 格式的示例：

**强调重点** �
- 这是一个无序列表项
- 这是另一个列表项

代码示例：
\`\`\`python
print("Hello, World!")  # � 快速开始
\`\`\`

状态提示：
- ✅ 任务完成
- ❌ 操作失败
- � 建议尝试其他方法

我会尽量自然地使用 Emoji 来让内容更生动有趣，但不会过度使用。� 有什么我可以帮助你的吗？`;
    const [messages,setMessages] = useState([
        { role:"user",content: "你好AI助手"},
        { role:"assistant",content:markdownText}
    ]);
    function pushNewMessage(message){
        setMessages(prev => [...prev, message]);
    }
    function DeleteMessage(){
        setMessages([]);
    }
    const containerRef = useRef(null);
    const [isAutoScroll, setIsAutoScroll] = useState(true);

    function smoothToBottom() {
        containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
        });
    }
    //判断是否滚动和滚动是否到达底部
    useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
        const isBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 5;
        setIsAutoScroll(isBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    //如果在底部，并且消息更新了，那就开始自动滚动
    useEffect(() => {
    if (isAutoScroll && containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight-containerRef.current.clientHeight-4.5;
    }
    }, [messages]);

    //new-chat直接返回，从new-chat加载过来的也返回，只有点按钮切换或者刷新进来的需要拉取右侧聊天框消息
    useEffect(()=>{
        if(!id) {console.log(1); return;}
        if(isNewChat) {navigate(location.pathname, { replace: true }); return; }
        DeleteMessage();
        const token = localStorage.getItem('token');
        if (!token) {
        navigate('/sign-in');
        return;
        }
        
        const fetchData = async () => {
        try {
        const res = await axios.get(baseURL+'/api/getMessages',{
                params: {
                    id:id
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
                });
        setMessages(res.data.sortedMessages);
        // 设置状态等
        } catch (error) {
        console.error('Failed to fetch:', error);
        }
        };

        fetchData();
    },[id]);

    async function handleSend(message,isNewChat,conversation_id) {
        setIsResponding(true);
        let new_messages = [];
        if(isNewChat)
        {
            DeleteMessage();
            pushNewMessage(message);
            new_messages = [message];
        }else{
            new_messages = [...messages,message];
            pushNewMessage(message);
            const token = localStorage.getItem('token');
            if (!token) {
            navigate('/sign-in');
            return;
            }
            const res_00 = await axios.post(baseURL+'/api/upLoadMessage', 
                {
                    message,
                    conversationId: conversation_id
                },
                {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                }
            );
        }


        const controller = new AbortController();
        abortControllerRef.current = controller;

        const res = await fetch(baseURL+'/api/chat-stream', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: new_messages,
            conversationId : conversation_id
        }),
        signal: controller.signal
        });

        setMessages(pre=>[...pre,{ role:"assistant",content:""}]);
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        
        let done = false;
        let buffer = '';
        while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone; //更新done的状态,可能人为终止

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split('\n');
        buffer = lines.pop(); // 移除可能不完整的最后一个，等下一轮接上。

        for (const line of lines) {
            if (line.startsWith('data:')) {
            const data = line.replace(/^data:\s*/, '');
            if (data === '[DONE]') {
                done = true;
                break;
            }

            try {
                const parsed = JSON.parse(data);
                const content = parsed.content;
                if (content) {
                setMessages(pre=>[...pre.slice(0, -1),{role:"assistant",content:pre[pre.length-1].content+content}]);
                }
            } catch (err) {
                console.error('JSON parse error:', err);
            }
            }
        }
        }

        setIsResponding(false);
    }

    const handleCancel = () => {
        if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setIsResponding(false);
        }
    };

    return (<div className="h-100">
        <ChatPartHeader email = {props.email}/>
        
        {!id&&<div className="h-[80%] flex flex-col items-center justify-center bg-background">
            <h1 className="!text-4xl font-bold">Where should we begin?</h1>
  <ChatFooter isFixed={false} pushMethod = {pushNewMessage} email={props.email} user_id={props.user_id}
    updateList = {props.updateList} DeleteMessage = {DeleteMessage} isResponding = {isResponding}
    setIsResponding = {setIsResponding} handleSend = {handleSend} handleCancel = {handleCancel}
  />
</div>}
       
    {id&&
      <div ref = {containerRef} className="overflow-y-auto h-[calc(100vh-180px)] px-4"><ChatBody markdownText={markdownText} messages={messages} email={props.email} />
      <div className="h-[160px]"></div>
      </div>
    }
    {id&&<div className="flex items-center justify-center bg-background">
  <ChatFooter isFixed={true} pushMethod = {pushNewMessage} email={props.email} user_id={props.user_id}
    updateList = {props.updateList} DeleteMessage = {DeleteMessage} isResponding = {isResponding}
    setIsResponding = {setIsResponding} handleSend = {handleSend} handleCancel = {handleCancel}
    smoothToBottom = {smoothToBottom}
  />
</div>}
    </div>)
}