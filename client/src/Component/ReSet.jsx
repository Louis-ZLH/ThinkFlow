import {React,useState,useRef,useEffect} from "react";
import { useNavigate } from "react-router";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography } from "@mui/material";
import Button from '@mui/material/Button';
import axios from "axios"
import { useLocation } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function ReSet(){
    const passwordInputRef = useRef(null);
    const baseURL = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [info,setInfo] = useState({email:"", password:"", code:"", change:true});
    const [showPassword, setShowPassword] = useState(false); //表示是否展示密码
    const [isSending,setIsSending] = useState(false); //表示是否在申请发送验证码中
    const [isResending,setIsResending] = useState(false); //表示是否在申请重新发送验证码中
    const [isRegistering,setIsRegistering] = useState(false); //表示是否在注册中
    const [isSended,setIsSended] = useState(false); //表示此页面验证码是否被发过
    const [isCodeActive,setIsCodeActive] = useState(true) //表示是否可以resend
    const [countdown, setCountdown] = useState(0); //用于resend倒计时
    const [countdown_1, setCountdown_1] = useState(null); //用于页面跳转倒计时

    useEffect(() => {
        if (countdown_1 === null) return;
        if (countdown_1 === 0) {
            navigate('/sign-in', {
            state: {
                pre_email: info.email,
                pre_password: info.password,
                pre_showPassword: showPassword
            }
      });
        }
    }, [countdown_1]);

    const handleClickShowPassword = () => {
      const input = passwordInputRef.current;
      const cursorPos = input.selectionStart;

      setShowPassword((prev) => !prev);

      setTimeout(() => {
        input.focus();
        input.setSelectionRange(cursorPos, cursorPos);
      }, 0);
    };

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    };

    function handleInfoChange(e){
        const {name,value} = e.target;
        // if(name==="email") setIsSended(false);
        setInfo((pre)=>{
            return {
                ...pre,
                [name] : value
            }
        })
    }

    const handleChangeSuccess=()=>{
        console.log('Prepare for change to login!');
        setCountdown_1(5);
        const timer = setInterval(() => {
        setCountdown_1((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    }

    const handleResend = () => {
    // 模拟发送验证码
    console.log('Resend code');
    setIsCodeActive(false);
    setCountdown(60);

    // 倒计时
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCodeActive(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
    async function HandleResend(){
      setIsResending(true);
      try{
            const res = await axios.post(baseURL+'/api/sendCode', info, {
            headers: {
            'x-api-key': apiKey // ✅ 替换为你的 key
            }
          })
            handleResend();
            setIsSended(true);
          }catch(err)
          {
            if (err.response) {
            setError(err.response.data.error || '发送验证码失败');
            } else {
                setError('网络错误，请稍后再试');
            }
          }
      setIsResending(false);
  }

    async function handleSubmitRegister(e) {
        e.preventDefault();
        const clickedButton = e.nativeEvent.submitter;
        const action = clickedButton.value;
        console.log(action);
        setError('');
        if (action === 'sendEmail')
        {
          setIsSending(true);
          try{
            const res = await axios.post(baseURL+'/api/sendCode', info, {
            headers: {
            'x-api-key': apiKey // ✅ 替换为你的 key
            }
          })
            console.log(res.data);
            setIsSending(false);
            setIsSended(true);
            handleResend();
          ;
          }catch(err)
          {
            if (err.response) {
            setError(err.response.data.error || '发送验证码失败');
            } else {
                setError('网络错误，请稍后再试');
            }
            setIsSending(false);
          }
        }
        else if(action === 'register')
        {
        setIsRegistering(true);
        try {
        const res = await axios.post(baseURL+'/api/change', info, {
            headers: {
            'x-api-key': apiKey // ✅ 替换为你的 key
            }
        });

        console.log(res.data);
        setIsRegistering(false);
        handleChangeSuccess();

        } catch (err) {
        if (err.response) {
            setError(err.response.data.error || '注册失败');
        } else {
            setError('网络错误，请稍后再试');
        }
        }
        setIsRegistering(false);
        //setInfo({ email: '', password: '' ,code:'',change:true});
      }
    }




    return (
        <Box
      component="form"
      onSubmit={handleSubmitRegister}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        width: '320px',
        height: '400px',
        mx: 'auto',
        mt: 15,
        p: 4,
        bgcolor: '#1e1e1e',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" color="white" textAlign="center">
        Reset your password
      </Typography>
      {error && (
        <Typography variant="body2" color="error" textAlign="center">
          {error}
        </Typography>
      )}

      {countdown_1>0 && (<Typography variant="body2" color="primary" textAlign="center">
          Jump to login after {countdown_1} seconds
        </Typography>)}

      <TextField label="Email" type="email" name="email" variant="outlined" required fullWidth
        InputLabelProps={{ style: { color: '#ccc' } }} InputProps={{ style: { color: '#fff' } }}
        onChange = {handleInfoChange} value={info.email}
      />

      {isSended&&<TextField label="New Password" type={showPassword?"text":"password"}
        name="password" variant="outlined" required
        fullWidth
        inputProps={{ 
          minLength: 6, 
          maxLength: 20
        }}
        InputLabelProps={{ style: { color: '#ccc' } }}
        InputProps={{ 
          style: { color: '#fff' },
          endAdornment: (
        <InputAdornment position="end">
          <IconButton
            aria-label={showPassword ?'show the password':'hide the password'}
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
          >
            {showPassword ?<Visibility />:<VisibilityOff />}
          </IconButton>
        </InputAdornment>
    ),
      }}
        onChange = {handleInfoChange}
        value={info.password}
        inputRef={passwordInputRef}
      />
      }

      {!isSended&&<Button variant="contained" color="primary" type="submit" fullWidth
        loading = {isSending?true:false}
        loadingPosition="end"
        name="action" 
        value="sendEmail"
        >
        Send verification code
      </Button>}
      {isSended&&<TextField
        label="Verification Code"
        type="code"
        name="code"
        value={info.code}
        onChange = {handleInfoChange}
        variant="outlined"
        required
        fullWidth
        inputProps={{ 
          maxLength: 6,
          minLength: 6
        }}
        InputLabelProps={{ style: { color: '#ccc' } }}
        InputProps={{
        style: { color: '#fff' },
        endAdornment: (
          <InputAdornment position="end" sx={{ width: '50%',height:'100%' }}>
            <Button
            loading = {isResending?true:false}
            loadingPosition="end"
              variant="contained" color="primary"
              onClick={HandleResend}
              disabled={!isCodeActive}
              sx={{
            height: '100%',
            width: '100%',
            minWidth: 0,
            padding: 0,
            fontSize: '1rem',
          }}
            >
              {isCodeActive ?'Resend':`${countdown}s`}
            </Button>
          </InputAdornment>
        )
      }}
      />}
      {isSended&&<Button variant="contained" color="primary" type="submit" fullWidth
        loading = {isRegistering?true:false}
        loadingPosition="end"
        name="action" 
        value="register"
        disable = {countdown_1>0}
        >
        Change Password
      </Button>}
    </Box>
    );
}

export default ReSet;