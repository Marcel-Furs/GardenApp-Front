import { Fragment, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginContext } from './context/LoginContext';
import './App.css';
import AppNavbar from './components/AppNavbar/AppNavbar.component';
import Home from './components/Home/Home.component'
import Login from './components/Login/Login.component'
import Register from './components/Register/Register.component'
import Authorized from './common/Authorized.component';
import Logout from './components/Logout/Logout.component'
import Plant from './components/Plant/Plant.component'
import Measurement from './components/Measurement/Measurement.component'
import PickCalendar from './components/PickCalendar/PickCalendar.component'
import Task from './components/Task/Task.component'

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"))

  return (
    <Fragment>
      <BrowserRouter>
        <LoginContext.Provider value={[token, setToken]}>
          <AppNavbar/>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register/>} />

            <Route path='/plant' element={<Authorized><Plant /></Authorized>} />
            <Route path='/measurement' element={<Authorized><Measurement /></Authorized>} />
            <Route path='/task' element={<Authorized><Task /></Authorized>} />
            <Route path='/pickcalendar' element={<Authorized><PickCalendar /></Authorized>} />
            <Route path='/logout' element={<Authorized><Logout /></Authorized>} />
          </Routes>
          </LoginContext.Provider>
      </BrowserRouter>
      <Toaster/>
    </Fragment>
  );
}
export default App;