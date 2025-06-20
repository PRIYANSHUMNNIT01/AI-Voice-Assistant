import { useState } from 'react'
import { Route, Routes } from 'react-router'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Customize from './pages/Customize'
import Customize2 from './pages/Customize2'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/customize" element={<Customize/>}/>
      <Route path="/customize2" element={<Customize2/>}/>
    </Routes>
  )
}

export default App
