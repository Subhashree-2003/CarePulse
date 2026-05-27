import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Docdashboard from './Components/Doctor/Docdashboard';

function App() {
  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path="/" element = { <Docdashboard />} />
      </Routes>
     </BrowserRouter> 
    </>
  )
}

export default App;
