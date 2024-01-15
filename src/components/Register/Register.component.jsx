import './Register.component.css';
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {ENDPOINTS} from "../../api/urls.component"
import { post } from "../../api/requests.component";
import toast from 'react-hot-toast'

function Register()
{
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")


  const onSubmit = async (e) => {
    e.preventDefault();
    if (password1.length < 4 || username.length < 4) {
      toast.error("Hasło musi zawierać co najmniej 4 znaki!");
      return;
    }

      if(password1 !== password2)
      {
          toast.error("Hasła nie są takie same!")
          return;
      }  
      
      const onSuccess = (response, data) => {
        toast.success('Pomyślnie zarejestrowano!')
        navigate("/login")
      }

      const onFail = (response) => {
        toast.error("Register failed!")
      }

      const body = {
        username: username,
        password: password1
      }
     await post(ENDPOINTS.Register, body, onSuccess, onFail)
  }

  const USER_REGEX = /^[a-zA-z][a-zA-Z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
  const userRef = useRef();
  const errRef = useRef();
  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [success, setSuccess] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
}, [])

useEffect(() => {
    setValidName(USER_REGEX.test(user));
}, [user])

useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
}, [pwd, matchPwd])

useEffect(() => {
  setErrMsg('');
}, [user, pwd, matchPwd])

  const handleUserInput = (e) => {
  const inputValue = e.target.value;
  setUser(inputValue);
  setValidName(USER_REGEX.test(inputValue));
  };


  return(
        <div class="center-container">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <form class="register-form"  onSubmit={onSubmit}>           
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

                onInput={e => setUsername(e.target.value)}
                >
                </input>
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
                <label htmlFor="password" className="form-label">Hasło
                <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                </label>
                <input
                type="password" 
                className="form-control" 
                id="password" 
                onInput={e => setPassword1(e.target.value)}
                aria-invalid={validPwd ? "false" : "true"}
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                aria-describedby="pwdnote"
                />
                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 do 24 wyrazów.<br />
                            Wymagane zaczęcie od wielkiej litery.<br />
                Litery, liczby, podkreślenia, myślniki dozwolone.
                        </p>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Powtórz hasło</label>
                <input type="password" className="form-control" id="password" onInput={e => setPassword2(e.target.value)}></input>
              </div>
            <button className="btn btn-success" type="submit">Zatwierdź</button>
        </form>
        </div>
    ); 
}
export default Register