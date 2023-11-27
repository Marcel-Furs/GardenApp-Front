import { Link } from 'react-router-dom';
import './Home.component.css';
import { Button } from '@mui/material';

function Home()
{
    return(
        <div className="home-container">
            <h1>Witajcie, Pasjonaci Ogrodnictwa!</h1>
                <p className="welcome-text">
                    Witamy w naszej specjalnie stworzonej aplikacji dla pasjonatów ogrodnictwa! Tutaj możecie śledzić rozwój waszego ogrodu, dodawać nowe rośliny do kolekcji,
                    dzielić się inspiracjami oraz korzystać z przydatnych porad ogrodniczych.
                    Aplikacja to idealne narzędzie do monitorowania i zarządzania waszym ogrodem z łatwością.
                 </p>
            <Button component={Link} to="/login" variant="contained" color="primary">
                Przejdź do logowania
            </Button>
        </div>
    )
}
export default Home