import React, { useState } from "react";
import Button from '@mui/material/Button';
import axios from "axios";
import { Textarea } from "@/components/ui/textarea"
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ArrowCircleUpTwoToneIcon from '@mui/icons-material/ArrowCircleUpTwoTone';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowCircleUpSharpIcon from '@mui/icons-material/ArrowCircleUpSharp';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { Switch } from "@/components/ui/switch";
import { IconButton } from "@mui/material";
import { Content } from "@radix-ui/react-dialog";
import { es2015 } from "globals";
import Tooltip from '@mui/material/Tooltip';

export function ChatFooter(props) {
    const baseURL = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const location = useLocation();
    const localTextareaRef = useRef(null);
    const stringForClassName = props.isFixed?"fixed bottom-0 z-10 w-[66%] bg-background pb-0":"z-10 w-[65%] bg-background pb-0"
    const [question,setQuestion] = useState('');
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    function handleInput() {
    const textarea = localTextareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto"; // 重置高度
    const maxHeight = 200; // 最多撑到 200px（大约 6 行）
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
  }

    async function handleSubmit(e){
        e.preventDefault();
        let message = { role : 'user', content: question};
        if(!id){
            const new_id = crypto.randomUUID();
            console.log(new_id);
            setLoading(true);
            try {
            const token = localStorage.getItem('token');
            const res_0 = await axios.get(baseURL+'/api/createTitle', {
                params: {
                    content: question
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
                });
            const title = res_0.data.title;
            console.log(title);
            console.log(props.user_id);
            const res = await axios.post(baseURL+'/api/createConversation', 
                {
                    id:new_id,
                    user_id:props.user_id,
                    title:title,
                    first_message:message
                },
                {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                }
            );
            if(res.data.success)
            {
                console.log(res.data);
                const newConversation = res.data.conversation;
                const new_item = { title: newConversation.title, url: `/chat/${newConversation.id}` };
                props.updateList(pre=>{
                    const todayList = pre.filter((item)=>{
                        return item.title === "Today"
                    })
                    console.log(todayList.length);
                    if(todayList.length===0)
                    {
                        if(pre.length<=1){
                            return [pre[0],{
                                title: "Today",
                                items: [
                                    new_item
                                ]
                            }];
                        }
                        return [pre[0],
                            {
                                title: "Today",
                                items: [
                                    new_item
                                ]
                            },...pre.slice(1)
                        ]
                    }else{
                        if(pre.length<=2)
                        {
                            return [pre[0],{
                            title: "Today",
                            items: [new_item,...pre[1].items]
                        }]
                        }
                        return [pre[0],
                        {
                            title: "Today",
                            items: [new_item,...pre[1].items]
                        },
                        ...pre.slice(2)
                        ]
                    }
                });
                setLoading(false);
                navigate(new_item.url,{
                state: {
                    isNewChat :true
                }});
                await props.handleSend(message,true,new_id);
            }else{
                console.log(res.data);
            }
            } catch (err) {
            if (err.response) {
                alert(err.response.data.error || '创建新对话失败');
            } else {
                console.log(err);
            }
            }

        }else{ //非newChat 页面下
            if(!props.isResponding)
            {
                setQuestion('');
                props.smoothToBottom();
                await props.handleSend(message,false,id);
                const textarea = localTextareaRef.current;
                if (!textarea) return;
                textarea.style.height = "auto"; // 重置高度
            }
            else{
                props.handleCancel();
            }
        }

        setLoading(false);
    }

    function handleOnChange(e){
        const new_question = e.target.value;
        setQuestion(new_question);
    }


  return (
    <footer className={stringForClassName}>
      <div className="mx-auto max-w-4xl w-full">
        <form onSubmit={handleSubmit}>
            <div className="w-[100%] mb-0 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="px-4 py-2 bg-background rounded-t-lg dark:bg-gray-700">
                    <label htmlFor="question" className="sr-only">Your comment</label>
                    <textarea onChange={handleOnChange} name="question" value={question} ref = {localTextareaRef} onInput={handleInput} id="question" rows="1" className="w-full px-0 text-sm text-gray-900 bg-background border-0 dark:bg-gray-800 focus:outline-none dark:text-white dark:placeholder-gray-400" style={{resize:"none"}} placeholder="Ask anything..." ></textarea>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                    <Button variant="outlined" size="medium">
                        SuperThink
                    </Button>
                    <div className="flex ps-0 space-x-1 rtl:space-x-reverse sm:ps-2">
                        <Tooltip arrow slotProps={{popper: {modifiers: [{name: 'offset',options: {offset: [0, -14],},},],},}} title={!props.email?"Loading":(question.length===0&&!props.isResponding)?"Input can't be empty":props.isResponding||loading?null:"send"}>
                            <div>
                            <IconButton loading = {loading} type="submit" disabled={(question.length===0&&!props.isResponding)||!props.email?true:false} className="inline-flex justify-center items-center p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            {loading?null:(props.isResponding?<StopCircleIcon fontSize="large" sx={{ color: 'white' }}/>:<ArrowCircleUpSharpIcon fontSize="large" sx={{ color: 'white' }}/>)}
                            </IconButton>
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </div>
            {props.isFixed&&<p className="text-sm flex justify-center mb-0">ThinkFlow can make mistakes, just reference.</p>}
        </form>
      </div>
    </footer>
  );
}