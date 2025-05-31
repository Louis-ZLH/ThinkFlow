import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export function ChatBody(props){
    const markdownText = props.markdownText;
    const messages = props.messages;
    return (
            <div className="mx-auto max-w-3xl w-full">
                {/* <div style={{ color: 'black', textAlign: 'center', marginTop: '100px' }}>
                    {props.email ? <p>欢迎回来，{props.email}</p> : <p>正在验证身份...</p>}
                </div> */}
                {messages.map((item,index)=>{
                    if(item.role === "user")
                    {
                        return (<div key={index}>
                        <div className="h-[30px]"></div>
                        <div className="w-full flex justify-end mb-3">
                                    <div className="bg-gray-700 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[75%] text-xl">
                                        {item.content}
                                    </div>
                                </div><div className="h-[10px]"></div></div>
                                )
                    }
                    else{
                        return (
                            <div key={index} className="prose prose-invert prose-xl max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeHighlight]}
                                >
                                {item.content}
                                </ReactMarkdown>
                            </div>
                        )
                    }
                })}
            </div>

    );
}