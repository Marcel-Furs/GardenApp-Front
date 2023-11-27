
function Register()
{
    return(
        <div class="center-container">

        <form class="register-form"  >           {/** onSubmit={onSubmit}*/}
        <h1>Register</h1>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Nazwa użytkownika</label>
                <input type="text" className="form-control" id="username" ></input> {/** onInput={e => setUsername(e.target.value)}*/}
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