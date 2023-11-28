import './Register.component.css';
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

function Register()
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
      
        <div class="center-container">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <form class="register-form"  >           {/** onSubmit={onSubmit}*/}
        <h1>Rejestracja</h1>
          <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Nazwa użytkownika
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
                >
                </input> {/** onInput={e => setUsername(e.target.value)}*/}
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
                <label htmlFor="password" className="form-label">Hasło</label>
                <input type="password" className="form-control" id="password" ></input> {/**  onInput={e => setPassword1(e.target.value)} */}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Powtórz hasło</label>
                <input type="password" className="form-control" id="password" ></input>  {/**  onInput={e => setPassword2(e.target.value)} */}
              </div>
            <button className="btn btn-success" type="submit">Register</button>
        </form>
        </div>
    ); 
}
export default Register