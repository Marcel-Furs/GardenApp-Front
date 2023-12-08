import React from 'react';
import './Login.component.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast'
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context/LoginContext';
import { useContext } from 'react';
import { post } from '../../api/requests.component';
import { ENDPOINTS } from '../../api/urls.component';


function Login()
{
  const navigate = useNavigate()
    const [komunikat, setKomunikat] = useState("<pusty>")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [token, setToken] = useContext(LoginContext)
  
    const ustawKomunikat = (nowy) => {
      setKomunikat(nowy)
      console.log(nowy)
    }
  
    const onSubmit = async (e) => {
      e.preventDefault(); //dezaktywuje odswiezanie formularza po kliknieciu w submit
        console.log("Username " + username + " password " + password)
  
        const body = {
          username: username,
          password: password
        }
        
        const onSuccess = (response, data) => {
          console.log(data.token)
          localStorage.setItem("token", data.token)
          toast.success('Udało się zalogować!')
          navigate("/")
          setToken(data.token);
        }

        const onFail = (response) => {
          toast.error("Nieudane logowanie!")
          toast.error("Error code: " + response.status)
        }

        await post(ENDPOINTS.Login, body, onSuccess, onFail)
    }

    return(
      <div className="center-container">

      <form className="user-form" onSubmit={onSubmit}>
        <h1>Witamy ponownie!</h1>
      <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Nazwa użytkownika:
          </label>
          <input
            type="text"
            id="username"
            className="form-control"
            onInput={e => setUsername(e.target.value)}
          />
      </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Hasło
          </label>
          <input type="password" className="form-control" id="password" onInput={e => setPassword(e.target.value)}/>
        </div>

        <button type="submit" className="btn btn-success">
          Zaloguj
        </button>
      </form>
      <p></p>
      <Button component={Link} to="/register" variant="contained" color="success" size="small">
        Nie masz konta? Kliknij tu
      </Button>
    </div>
  );
}
export default Login