import { Link } from 'react-router-dom';
import './AppNavbar.component.css';
import { Button } from '@mui/material';

function AppNavbar()
{
    const urls=  [
        {url:"/", name:"Strona główna", auth:false},
        { url: "/login", name: "Logowanie", auth: false },
        { url: "/register", name: "Rejestracja", auth: false },
    ]

    const isVisible = (auth) => {
        return true;
    }

    return (
        <nav>
            <div className ="navbar-conatiner">
            <ul className="menu">
                <img src="LogoG.png" alt="logo" style={{ maxWidth: '50px', height: 'auto' }}/>
            {urls.map((x, index) => isVisible(x.auth) && (
                        <li key={index}>
                            <Button
                                className="nav-button"
                                component={Link}
                                to={x.url}
                                variant="outlined"
                                color="primary"
                                size="large"
                                
                            >
                                {x.name}
                            </Button>
                        </li>
                    ))}
            </ul>
            </div>
        </nav>
    )
}

export default AppNavbar;