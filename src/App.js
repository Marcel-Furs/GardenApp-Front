import { Fragment, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AppNavbar from './components/AppNavbar/AppNavbar.component';
import Home from './components/Home/Home.component'
import Login from './components/Login/Login.component'
import Register from './components/Register/Register.component'

function App() {
  return (
    <Fragment>
      <BrowserRouter>
          <AppNavbar/>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register/>} />
          </Routes>
      </BrowserRouter>
    </Fragment>
  );
}
export default App;