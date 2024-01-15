import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.component.css';
import { Button } from '@mui/material';
import { LoginContext } from '../../context/LoginContext';
import { parseJwt } from '../Helpers/helpers.component';
import { ENDPOINTS } from '../../api/urls.component';
import { get, get2, post } from '../../api/requests.component';
import toast from 'react-hot-toast';
import { Card, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs'

function Home()
{
    const [token ]= useContext(LoginContext);
    const [days, setDays] = useState([]);
    const [ldays, setLDays] = useState([]);
    const [userId, setUserId] = useState(null);
    const [weatherAlert, setWeatherAlert] = useState(null);
    const [city, setCity] = useState(null);
    const [noteValue, setNoteValue] = useState('');
    const [newSelectedDate, setNewSelectedDate] = useState(null);



    useEffect(() => {
        if (token) {
          const decodedToken = parseJwt(token);
          if (decodedToken && decodedToken.nameid) {
            setUserId(decodedToken.nameid);
          }
        }
      }, [token]);

      useEffect(() => {
        if (userId) {
            getDays();
            getLateDays()
        }
    }, [userId]);

    useEffect(() => {
        if (userId && city) {
            fetchDataFromDatabase();
        }
    }, [userId, city]);
    

    useEffect(() => {
        if (userId) {
            const storedCity = fetchCityFromLocalStorage();
            if (storedCity) {
                setCity(storedCity);
            }
        }
    }, [userId]);

    const getDays = async() => {
        const onSuccess = (resp, data) => {
            setDays(data)
        }

        const onFail = (resp) => {
            toast.error("Failed to fetch data")
        }
        await get(ENDPOINTS.Reminder.replace('{id}', parseInt(userId, 10)), onSuccess, onFail, token)
    }

    const getLateDays = async() => {
        const onSuccess = (resp, data) => {
            console.log(data)
            setLDays(data)
        }

        const onFail = (resp) => {
            toast.error("Failed to fetch data")
        }
        await get(ENDPOINTS.Late.replace('{id}', parseInt(userId, 10)), onSuccess, onFail, token)
    }

    const calculateDaysPast = (eventDate) => {
        const today = dayjs();
        const event = dayjs(eventDate);
        return today.diff(event, 'day');
    };

    const calculateDaysLeft = (eventDate) => {
        const today = dayjs();
        const event = dayjs(eventDate);
        return event.diff(today, 'day');
    };

    const fetchCityFromLocalStorage = () => {
        const city = localStorage.getItem('selectedCity');
        if (city) {
            return city;
        } else {
            toast.error("Nie wybrano miasta");
            return null;
        }
    };

    const fetchDataFromDatabase = async () => {
        const onSuccess = (resp, data) => {
                if (data === 1) {
                    setWeatherAlert("W ciągu ostatniego tygodnia spadło więcej niż 20ml opadów.");
                } else {
                    setWeatherAlert("W ciągu ostatniego tygodnia spadło mniej niż 20ml opadów.");
                }
        };
    
        const onFail = (error) => {
            toast.error("Nie istnieje dane miasto w bazie danych");
        };
    
        await get2(ENDPOINTS.Alert, parseInt(userId, 10), city, onSuccess, onFail, token);
    };

    const handleDoneClick = async (lday) => {
        if (window.confirm(`Czy na pewno chcesz oznaczyć jako zrobione: ${lday.description}?`)) {
        const body = {
            description: lday.description,
            eventDate: lday.eventDate,
            isActive: !lday.isActive,
            userId: lday.userId
          };
    
        const onSuccess = (response, data) => {
          toast.success('Wysłano!');
          getLateDays()
        };
    
        const onFail = (response) => {
          toast.error('Brak treści');
        };
    
        post(ENDPOINTS.UpdateLDay.replace('{dayId}', lday.id), body, onSuccess, onFail, token);
        }
      };
    
    return(
      <div className="home-container">
          <h1>Witajcie, Pasjonaci Ogrodnictwa!</h1>
          <p className="welcome-text">
              Witamy w naszej specjalnie stworzonej aplikacji dla pasjonatów ogrodnictwa!
            {!token && (
                 <p> Zaprojektowano innowacyjną aplikację do zarządzania ogrodem, która zapewnia kontrolę nad mikrokontrolerami, katalogowanie roślin oraz obserwacje warunków
                    atmosferycznych i zadań ogrodowych.
                 </p>
            )}
          </p>
          {token != null && (
              <div className="columns-container">
                  <div className="column">
                      <h2>Przypomnienia</h2>
                      {days.map((day, index) => (
                            <Card key={index} className="day-card">
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Liczba dni do zdarzenia: {calculateDaysLeft(day.eventDate)}
                                    </Typography>
                                    <Typography variant="h5">
                                        {day.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                  </div>
                  <div className="column">
                      <h2>Alerty</h2>
                      {weatherAlert && (
                        <Card className="alert-card" style={{ backgroundColor: 'red' }}>
                            <CardContent>
                                <Typography color="white" gutterBottom>
                                     Alert: {weatherAlert}
                                </Typography>
                            </CardContent>
                        </Card>
                         )}
             </div>
                  <div className="column">
                      <h2>Czy to już zostało wykonane?</h2>
                      {ldays.map((day, index) => (
                        <Card key={index} className="day-card">
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Ilość dni, które już minęły: {calculateDaysPast(day.eventDate)}
                                </Typography>
                                <Typography variant="h5">
                                 {day.description}
                                </Typography>
                                <Button 
                              variant="contained" 
                              color="primary" 
                              onClick={() => handleDoneClick(day)}
                            >
                                Zrobiono
                            </Button>
                            </CardContent>
                        </Card>
                        ))}
                  </div>
              </div>
          )}

          {!token && (
              <Button component={Link} to="/login" variant="contained" color="success">
                  Przejdź do logowania
              </Button>
          )}
      </div>
  );
}
export default Home;