import { Link } from 'react-router-dom';
import './AppNavbar.component.css';
import { Button } from '@mui/material';
import { Fragment, useContext, useState } from 'react';
import { LoginContext } from '../../context/LoginContext'
import { SvgIcon } from '@mui/material';

function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
  }

function AppNavbar()
{
    const [token, setToken] = useContext(LoginContext)

    const urls=  [
        {url:"/", name:"", auth:false},
        {url:"/", name:"", auth:true},
        { url: "/login", name: "Logowanie", auth: false },
        { url: "/register", name: "Rejestracja", auth: false },
        { url: "/device", name: "Dodaj mikrokontroler", auth: true },
        { url: "/plant", name: "Dodaj rośline", auth: true },
        { url: "/plants", name: "Rośliny", auth: true },
        { url: "/measurement", name: "Pomiary", auth: true },
        { url: "/chart", name: "Wykresy", auth: true },
        { url: "/pickcalendar", name: "Kalendarz", auth: true },
        { url: "/diaries", name: "Pamiętnik", auth: true },
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
        <div className="navbar-conatiner">
          <ul className="menu">
            <img
              src="LogoG.png"
              alt="logo"
              style={{ maxWidth: '50px', height: 'auto' }}
            />
            {urls.map((x) =>
              isVisible(x.auth) ? (
                <li key={x.url}>
                  <Button
                    className="nav-button"
                    component={Link}
                    to={x.url}
                    variant="outlined"
                    color={x.url === "/logout" ? "error" : "success"}
                    size="large"
                  >
                    <Fragment>
                      {x.url === "/" && <HomeIcon fontSize="large" />}
                      {x.name}
                    </Fragment>
                  </Button>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </nav>
    );
  }

export default AppNavbar;