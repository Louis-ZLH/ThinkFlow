import express from 'express';
import { signup,createConversation, login,sendCode,changePassword,
  initialize,createTitle,getMessages,
  GenerateChatStream,upLoadMessage,deleteConversation} from '../controllers/authController.js';
import checkApiKey from '../middleWare/checkApiKey.js';
import { verifyToken } from '../middleWare/verifyToken.js';

const router = express.Router();

router.post('/sendCode',checkApiKey,sendCode);

// 注册接口（受 API key 保护）
router.post('/signup', checkApiKey, signup);

router.post('/change', checkApiKey,changePassword);

// 登录接口（可选是否保护）
router.post('/login', checkApiKey,login);

router.post('/createConversation',verifyToken,createConversation)

router.post('/upLoadMessage',verifyToken,upLoadMessage)

router.post('/chat-stream',GenerateChatStream);

router.get('/verify', verifyToken, initialize);

router.get('/createTitle',verifyToken,createTitle);

router.get('/getMessages',verifyToken,getMessages);

router.delete('/deleteConversation/:id',verifyToken,deleteConversation);


export default router;