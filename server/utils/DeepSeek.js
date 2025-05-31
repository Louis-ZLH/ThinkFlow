// Please install OpenAI SDK first: `npm install openai`

import OpenAI from "openai";
import env from "dotenv";
env.config();

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_KEY
});

export async function generateTitle(message) {
  const completion = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: `Generate a concise and meaningful title for the user's message. 
                Length must be limited by the following rule:
                - Each Chinese character counts as **2 units**;
                - Each English letter, digit, or symbol counts as **1 unit**;
                - The **total length must not exceed 20 units**;
                Only return the title itself, without any explanation or punctuation beyond the title content.
                Do not add quotation marks.
                If needed, truncate gracefully to meet the limit.`
      },
      {
        role: "user",
        content: message
      }
    ]
  });
  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}


async function createChatCompletion(messageListFromUser) {
    const systemPrompt = `你是一个友好的 AI 助手，请用 Markdown 格式输出所有回复(内容中的‘反引号’请使用‘反斜杠+反引号’代替)。你可以适当使用 Emoji 表情（如 ✅ ❌ 🚀 💡）来增强可读性。

- 使用 # 到 ###### 来表示不同级别的标题
    - # 一级标题：页面主标题
    - ## 二级标题：模块标题（如“行程安排”）
    - ### 三级标题:子模块标题(如“Day 1:昆明”）
- 使用 --- 来分隔模块
- 使用 加粗 来强调重点
- 使用 - 创建无序列表
- 使用 Emoji 来表示状态或情绪，例如：
  - ✅ 成功
  - ❌ 失败
  - 💡 提示
  - 🚀 启动 / 高速

请自然地将 Emoji 加入内容中，但不要滥用。
同时注意排版清晰、层级分明、内容易读,
最终输出应该清爽、专业、有结构`;


  const completion = await openai.chat.completions.create({
    messages: [
            { role: "system", content: systemPrompt },
            ...messageListFromUser,
            ],
    model: "deepseek-chat",
    stream: true,
  });

  return completion;
}

export default createChatCompletion;