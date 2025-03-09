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
import Diary from './components/Diary/Diary.component'
import Plants from './components/Plants/Plants.component'
import Chart from './components/Chart/Chart.component'
import Device from './components/Device/Device.component'
import SensorType from './components/SensorType/SensorType.component'
import PlantProfile from './components/PlantProfile/PlantProfile.component'
import Condition from './components/Condition/Condition.component'
import Diaries from './components/Diaries/Diaries.component'

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

            <Route path='/condition' element={<Authorized><Condition /></Authorized>} />
            <Route path='/plantprofile' element={<Authorized><PlantProfile /></Authorized>} />
            <Route path='/sensortype' element={<Authorized><SensorType /></Authorized>} />
            <Route path='/device' element={<Authorized><Device /></Authorized>} />
            <Route path='/plant' element={<Authorized><Plant /></Authorized>} />
            <Route path='/plants' element={<Authorized><Plants /></Authorized>} />
            <Route path='/measurement' element={<Authorized><Measurement /></Authorized>} />
            <Route path='/diary' element={<Authorized><Diary /></Authorized>} />
            <Route path='/diaries' element={<Authorized><Diaries /></Authorized>} />
            <Route path='/chart' element={<Authorized><Chart /></Authorized>} />
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