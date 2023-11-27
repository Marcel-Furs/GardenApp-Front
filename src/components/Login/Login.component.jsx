import React from 'react';
import './Login.component.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast'
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Login()
{
    return(
      <div class="center-container">
        <form class="user-form" >
          <h1>Witamy ponownie!</h1>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Nazwa użytkownika</label>
              <input type="text" className="form-control" id="username" ></input>  {/* onInput={e => setUsername(e.target.value)}*/}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Hasło</label>
              <input type="password" className="form-control" id="password" ></input> {/*onInput={e => setPassword(e.target.value)}></input*/}
            </div>

          <button type="submit" className="btn-primary">Zaloguj</button>

        </form>
        <p></p>
        <Button component={Link} to="/register" variant="contained" color="primary" size="small">
         Nie masz konta? kliknij tu
        </Button>
      </div>
      
    )
}
export default Login