import {React,useState,useRef} from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography } from "@mui/material";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from '@mui/material/Link';
import { useLocation } from 'react-router-dom';

function Login(){
    const baseURL = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const location = useLocation();
    const { pre_email, pre_password, pre_showPassword} = location.state || {};
    const passwordInputRef = useRef(null);
    const [error, setError] = useState('');
    const [isVisit,setIsVisit] = useState(false);
    const navigate = useNavigate();
    const [info,setInfo] = useState({email:pre_email||'', password:pre_password||''});
    const [showPassword, setShowPassword] = useState(pre_showPassword);

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

    async function handleSubmitRegister(e) {
        e.preventDefault();
        setError('');
        setIsVisit(true);
        try {
        const res = await axios.post(baseURL+'/api/login', info, {
            headers: {
            'x-api-key': apiKey
            }
        });

        // 成功：保存 token + 跳转
        localStorage.setItem('token', res.data.token);
        console.log(res.data.token);
        navigate('/chat');

        } catch (err) {
        if (err.response) {
            setError(err.response.data.error || '登录失败');
        } else {
            setError('网络错误，请稍后再试');
        }
        }
        setIsVisit(false);
        setInfo({ email: '', password: '' });
    }

    function handleInfoChange(e){
        const {name,value} = e.target;
        setInfo((pre)=>{
            return {
                ...pre,
                [name] : value
            }
        })
        console.log(info);
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
        height: '425px',
        mx: 'auto',
        mt: 15,
        p: 4,
        bgcolor: '#1e1e1e',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" color="white" textAlign="center">
        Login
      </Typography>
      {error && (
              <Typography variant="body2" color="error" textAlign="center">
                {error}
              </Typography>
            )}
      {isVisit && (
              <Typography variant="body2" color="primary" textAlign="center">
                Logging in...
              </Typography>
            )}
      
      <TextField
        label="Email"
        type="email"
        name = "email"
        variant="outlined"
        required
        fullWidth
        InputLabelProps={{ style: { color: '#ccc' } }}
        InputProps={{ style: { color: '#fff' } }}
        value={info.email}
        onChange = {handleInfoChange}
      />

      <TextField
              label="Password"
              type={showPassword?"text":"password"}
              name="password"
              variant="outlined"
              required
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

      <Button variant="contained" color="primary" type="submit" disabled={isVisit}>
        Sign In
      </Button>
      <Button variant="contained" color="secondary" disabled={isVisit} onClick={()=>{
        navigate('/sign-up',{
            state: {
              pre_email: info.email,
              pre_password: info.password,
              pre_showPassword: showPassword
            }});
      }}>
        Sign up
      </Button>
      <Link position="bottom" href='/forget' underline="hover">
        Forget Password?
      </Link>
    </Box>
    );
}

export default Login;