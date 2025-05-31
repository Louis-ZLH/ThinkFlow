import React from "react";
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

function HomeBody(){
    const navigate = useNavigate();
    const theme = createTheme({
        palette: {
            ochre: {
            main: '#c0c0c0',         // 银灰
            light: '#e6e6e6',        // 浅灰
            dark: '#8c8c8c',         // 深灰
            contrastText: '#000000'  // 黑色字
            },
        },
        });
    return (<main className="px-3">
          <h1 style={{fontSize:"2.5rem"}}>ThinkFlow</h1>
          <p className="lead">Streamline your thoughts. Shape your future.</p>
          <p className="lead">
            <ThemeProvider theme={theme}>
            <Button variant="contained" color="ochre" size="large"
              onClick = {()=>{
                navigate('/chat');
              }}
            >Try It</Button>
            </ThemeProvider>
          </p>
        </main>);
}

export default HomeBody;