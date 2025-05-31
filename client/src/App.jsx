import React,{ useState } from 'react'
import Home from './pages/HomePage'
import SignIn from './pages/SignIn';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import ChatPage from './pages/ChatPage';
import Forget from './pages/Forget';


function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/chat"     element={<ChatPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
      </Routes>
    </Router>
  )
}

export default App
