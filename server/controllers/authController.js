import bcrypt from 'bcrypt';
import db from '../db.js';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/sendEmail.js';
import createChatCompletion,{ generateTitle } from '../utils/DeepSeek.js';

export async function deleteConversation(req,res) {
    const { id } = req.params;
    console.log("要删除的 id:", req.params.id);
    try {
      await db.query("BEGIN"); // 开启事务

      await db.query("DELETE FROM messages WHERE conversation_id = $1", [id]);
      await db.query("DELETE FROM conversations WHERE id = $1", [id]);

      await db.query("COMMIT"); // 提交事务
      res.status(200).json({ message: "删除成功" });
    } catch (err) {
      await db.query("ROLLBACK"); // 出错回滚
      console.error("删除失败:", err);
      res.status(500).json({ error: "删除失败" });
    }
}


export async function upLoadMessage(req,res) {
  const {message,conversationId} = req.body;
  try{
    const result = await db.query("INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)",[conversationId,message.role,message.content]);
    return res.status(200).json({ message: 'Insert new message successfully' });
  }catch(err)
  {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}


export async function GenerateChatStream(req,res) {
  let fullMessage = '';
  const messageListFromUser = req.body.messages;
  const conversationId = req.body.conversationId;
  const completion = await createChatCompletion(messageListFromUser);

  //流式处理 设置流式响应头
  res.setHeader('Content-Type', 'text/event-stream');//开启流式事件
  res.setHeader('Cache-Control', 'no-cache');//无缓存
  res.setHeader('Connection', 'keep-alive'); //保持连接

  try{
    for await (const chunk of completion) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) {
        fullMessage += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    // 正常完成时
    res.write('data: [DONE]\n\n');
    res.end();
  }catch(err)
  {
    console.warn('Stream interrupted:', err.message); //用户中止、断网等中断情况
    res.end(); // 防止连接挂起
  }finally{
    if (fullMessage.length>0) {
    await db.query(
      'INSERT INTO messages (conversation_id, role, content, created_at) VALUES ($1, $2, $3, NOW())',
      [conversationId, 'assistant', fullMessage]
    );
  }
}}


export async function getMessages(req,res) {
  const id = req.query.id;
  try{
    const result = await db.query("SELECT * FROM messages where conversation_id=$1",[id]);
    const messages = result.rows;
    const sortedMessages = messages
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    res.status(201).json({
      success: true,
      sortedMessages
    })
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
  
}

export async function createConversation(req,res) {
  const {id ,user_id, title,first_message} = req.body;
  console.log(req.body);
  try{
    const conversationResult = await db.query("INSERT INTO conversations (id,user_id,title) VALUES ($1, $2, $3) RETURNING *",[id,user_id,title]);
    await db.query("INSERT INTO messages (conversation_id,role,content) VALUES ($1,$2,$3)",[id,first_message.role,first_message.content]);

    res.status(201).json({
      success: true,
      conversation: conversationResult.rows[0],
      message: "对话创建成功"
    });
  }catch(err)
  {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }

}

export async function createTitle(req,res) {
  const content = req.query.content;
  try{
    const title = await generateTitle(content);
    res.status(200).json({ title:title });
  }catch(err)
  {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}


export async function initialize(req,res) {
  const user_id = req.user.userId;
  const email = req.user.email;
  console.log(user_id);
  console.log(email);
  try{
    const result = await db.query("SELECT * FROM conversations WHERE user_id=$1",[user_id]);
    const conversationList = result.rows;
    res.status(200).json({ email:email, conversationList:conversationList, userId: user_id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
}
}


export async function changePassword(req,res) {
  const { email, password, code} = req.body;
  try {
        const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.rows.length === 0) {
        return res.status(409).json({ error: 'Email not exists' });
        }
        const isExistInPending = await db.query("SELECT * FROM pending_users WHERE email=$1 AND created_at > NOW() - INTERVAL '5 minutes'",[email]);
        
        if(isExistInPending.rows.length===0)
        {
          return res.status(400).json({ error: 'Time out, please resend verification code' });
        }
        else{
          if(code.toString() === isExistInPending.rows[0].code.toString())
          {
            await db.query('DELETE FROM pending_users WHERE email=$1',[email]);
          }
          else{
            await db.query('DELETE FROM pending_users WHERE email=$1',[email]);
            return res.status(400).json({ error: 'Incorrect Code, please resend and try again' });
          }
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 更新数据库
        const result = await db.query(
        'UPDATE users SET password = $1, created_at = CURRENT_TIMESTAMP WHERE email=$2',
        [hashedPassword,email]
        );

        res.status(201).json({
        message: 'Reset password successfully'
        });
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }

}


export async function sendCode(req,res) {
  const { email, change } = req.body;
  if (!email || !email.match(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  try{
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0 && !change) {
    return res.status(409).json({ error: 'Email already exists' });
    }

    if(existing.rows.length ===0 && change)
    {
      return res.status(409).json({ error: 'Email not exists' });
    }

    const recent = await db.query(`
      SELECT created_at FROM pending_users 
      WHERE email = $1 AND created_at > NOW() - INTERVAL '60 seconds'
    `, [email]);
    if (recent.rows.length > 0) {
      return res.status(429).json({ error: 'Please wait before requesting another code' });
    }

    const code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    const IsSuccess = await sendVerificationEmail(email, code);
    if(!IsSuccess)
    {
      return res.status(400).json({ error: 'Unable to send code, wait to try again.' });
    }
    const isExist = await db.query('SELECT * FROM pending_users WHERE email = $1', [email])
    if(isExist.rows.length > 0)
    {
      await db.query('UPDATE pending_users SET code = $1, created_at = CURRENT_TIMESTAMP WHERE email=$2',[code,email]);
    }
    else{
      await db.query('INSERT INTO pending_users (email, code) VALUES ($1, $2)', [email, code]);
    }
    return res.status(200).json({ message: 'Verification code sent successfully' });
  }catch(err)
  {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}


export async function signup(req, res) {
  const { email, password, code} = req.body;

  try {
        const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Email already exists' });
        }

        const isExistInPending = await db.query("SELECT * FROM pending_users WHERE email=$1 AND created_at > NOW() - INTERVAL '5 minutes'",[email]);
        
        if(isExistInPending.rows.length===0)
        {
          return res.status(400).json({ error: 'Time out, please resend verification code' });
        }
        else{
          if(code.toString() === isExistInPending.rows[0].code.toString())
          {
            await db.query('DELETE FROM pending_users WHERE email=$1',[email]);
          }
          else{
            await db.query('DELETE FROM pending_users WHERE email=$1',[email]);
            return res.status(400).json({ error: 'Incorrect Code, please resend and try again' });
          }
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 插入数据库
        const result = await db.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [email, hashedPassword]
        );

        const userId = result.rows[0].id;

        // 生成 token
        const token = jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: '2h' } // 2 小时过期
        );

        res.status(201).json({
        message: 'User registered successfully',
        token
        });
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    // 查找用户
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: '邮箱未注册' });
    }

    const user = result.rows[0];

    // 比对密码
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: '密码错误' });
    }

    // 登录成功，生成 token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.status(200).json({ token });

  } catch (err) {
    console.error('登录错误', err);
    res.status(500).json({ error: '服务器错误' });
  }
}