import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Home.component.css';
import { Button } from '@mui/material';
import { LoginContext } from '../../context/LoginContext';

function Home()
{
    const [token ]= useContext(LoginContext);

    return(
        <div className="home-container">
        <h1>Witajcie, Pasjonaci Ogrodnictwa!</h1>
        <p className="welcome-text">
          Witamy w naszej specjalnie stworzonej aplikacji dla pasjonatów ogrodnictwa! Tutaj możecie śledzić rozwój waszego ogrodu, dodawać nowe rośliny do kolekcji, dzielić się inspiracjami oraz korzystać z przydatnych porad ogrodniczych. Aplikacja ta, to idealne narzędzie do monitorowania i zarządzania waszym ogrodem.
        </p>

        {token != null ? (
          <p>Jesteś już zalogowany!</p>
        ) : (
          <Button component={Link} to="/login" variant="contained" color="success">
            Przejdź do logowania
          </Button>
        )}
      </div>
    );
}
export default Home