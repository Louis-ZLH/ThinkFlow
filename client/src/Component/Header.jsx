import { buttonBaseClasses } from "@mui/material";
import React from "react";
import { Link } from 'react-router-dom';

function Header(props){
    const buttonClassName = {
        Home : "nav-link fw-bold py-1 px-0",
        Login : "nav-link fw-bold py-1 px-0",
        Contact : "nav-link fw-bold py-1 px-0"
    };
    buttonClassName[props.whichPage] += " active";

    return (<header className={props.whichPage==="Home"?"mb-auto":null}>
          <div>
            <div>
              
            <h3 className="float-md-start mb-0">
              <img src="/LogoTF.svg" alt="Logo" style={{height:"25px",borderRadius:"25%",position: "relative",
    top: "-2.5px"}}/> 
              ThinkFlow</h3>
            </div>
            <nav className="nav nav-masthead justify-content-center float-md-end">
              <Link className={buttonClassName.Home} to="/">Home</Link>
              <Link className={buttonClassName.Login} to="/sign-in">Login</Link>
              <Link className={buttonClassName.Contact} to="/contact">Contact</Link>
            </nav>
          </div>
        </header>);
}

export default Header;