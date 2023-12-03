import { Link } from 'react-router-dom';
import './AppNavbar.component.css';
import { Button } from '@mui/material';
import { Fragment, useContext, useState } from 'react';
import { LoginContext } from '../../context/LoginContext'

function AppNavbar()
{
    const [token, setToken] = useContext(LoginContext)

    const urls=  [
        {url:"/", name:"Strona główna", auth:false},
        { url: "/login", name: "Logowanie", auth: false },
        { url: "/register", name: "Rejestracja", auth: false },
        { url: "/plant", name: "Dodaj rośline", auth: true },
        { url: "/logout", name: "Wyloguj", auth: true }
    ]

    const isVisible = (auth) => {
        if(token == null && !auth) {
            return true;
          }
          if(token != null && auth) {
            return true;
          }
          return false;
    }

    return (
        <nav>
            <div className ="navbar-conatiner">
            <ul className="menu">
                <img src="LogoG.png" alt="logo" style={{ maxWidth: '50px', height: 'auto' }}/>
            {urls.map( x => isVisible(x.auth) ? (
                        <li >
                            <Button
                                className="nav-button"
                                component={Link}
                                to={x.url}
                                variant="outlined"
                                color={x.url === "/logout" ? "error" : "success"}
                                size="large"
                                
                            >
                                {x.name}
                            </Button>
                        </li>

                    ) : ""
                    )}
            </ul>
            </div>
        </nav>
    )
}

export default AppNavbar;