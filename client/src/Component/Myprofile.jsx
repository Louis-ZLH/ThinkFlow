import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";


export function MyProfile(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token"); // 清除 token
    navigate("/"); // 跳转到登录页
  }

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
        <Button
        id="basic-button"
        variant="contained"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
            backgroundColor: '#475569',
            color: '#F4F4F5',
            '&:hover': {
            backgroundColor: '#64748B',
            },
            '&:active': {
            backgroundColor: '#334155',
            },
            paddingX: 2.5,
    paddingY: 1,
    borderRadius: '0.5rem',
    '&:hover': { backgroundColor: '#64748B' }
        }}
      >
        My profile
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>{props.email}</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}