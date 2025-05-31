import React,{useState}from "react";
import Register from "../Component/Register";
import Header from "../Component/Header";

function SignUp(){
    
    return (
    <div className="d-flex h-100 text-center text-bg-dark" style={{
    background: 'radial-gradient(ellipse at bottom,rgb(51, 60, 70), #000)',
    textShadow: '0 .05rem .1rem rgba(0, 0, 0, 0.5)',
    boxShadow: 'inset 0 0 5rem rgba(0, 0, 0, 0.5)',}}>
    <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <Header whichPage="Login"/>
        <Register />
    </div>
    </div>
    );
}

export default SignUp;