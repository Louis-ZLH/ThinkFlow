import React,{useState}from "react";
import ReSet from "../Component/ReSet";
import Header from "../Component/Header";
function Forget(){
    
    return (
    <div className="d-flex h-100 text-center text-bg-dark" style={{
    background: 'radial-gradient(ellipse at bottom,rgb(51, 60, 70), #000)',
    textShadow: '0 .05rem .1rem rgba(0, 0, 0, 0.5)',
    boxShadow: 'inset 0 0 5rem rgba(0, 0, 0, 0.5)',}}>
    <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <Header whichPage="Login"/>
        <ReSet />
    </div>
    </div>
    );
}

export default Forget;