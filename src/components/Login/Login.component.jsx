import React from 'react';
import './Login.component.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast'
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";


function Login()
{
  const USER_REGEX = /^[a-zA-z][a-zA-Z0-9-_]{3,23}$/;
  //const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;   regex dla hasła
  const userRef = useRef();
  const errRef = useRef();
  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
}, [])

useEffect(() => {
  setValidName(USER_REGEX.test(user));
}, [user])

  const handleUserInput = (e) => {
  const inputValue = e.target.value;
    setUser(inputValue);
    setValidName(USER_REGEX.test(inputValue));
  };

    return(
      <div className="center-container">
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <form className="user-form">
        <h1>Witamy ponownie!</h1>
      <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Nazwa użytkownika:
            <FontAwesomeIcon icon={validName ? faCheck : faTimes} className={validName ? 'valid' : 'invalid'} />
          </label>
          <input
            type="text"
            id="username"
            ref={userRef}
            autoComplete = "off"
            className={`form-control ${validName ? '' : 'is-invalid'}`}
            onChange={(e) => setUser(e.target.value)}
            required
            aria-invalid={validName ? 'false' : 'true'}
            aria-describedby="uidnote"
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
            value={user}
          />

          {/* onInput={e => setUsername(e.target.value)} */}
          <div className="invalid-feedback">
          {user.trim() !== '' && userFocus && !validName && (
          <p id="uidnote" className="instructions">
          <FontAwesomeIcon icon={faInfoCircle} />
          4 do 24 wyrazów.<br />
          Wymagane zaczęcie od wielkiej litery.<br />
          Litery, liczby, podkreślenia, myślniki dozwolone.
          </p>
          )}
        </div>
      </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Hasło
          </label>
          <input type="password" className="form-control" id="password" />
          {/* onInput={e => setPassword(e.target.value)}></input */}
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