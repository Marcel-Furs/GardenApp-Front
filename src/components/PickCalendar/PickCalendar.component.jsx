import React, { useState, useContext, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import plLocale from 'date-fns/locale/pl';
import { Button, Grid } from '@mui/material';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import './PickCalendar.component.css';
import dayjs from 'dayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { ENDPOINTS } from '../../api/urls.component';
import { LoginContext } from '../../context/LoginContext';
import { post, get } from '../../api/requests.component';
import { useNavigate } from 'react-router-dom';
import { parseJwt } from '../Helpers/helpers.component';
import { ServerDay } from './ServerDay.component.jsx';
import 'dayjs/locale/pl';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.locale('pl'); // Ustawienie polskiej lokalizacji
dayjs.extend(updateLocale);

dayjs.updateLocale('pl', {
  weekStart: 1 // Ustawienie poniedziałku jako pierwszego dnia tygodnia
});

function PickCalendar() {
  const [value, setValue] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [noteValue, setNoteValue] = useState('');
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([]);
  const initialValue = dayjs();
  const [calendarValue, setCalendarValue] = useState(initialValue);
  const [token, setToken] = useContext(LoginContext);
  const [userId, setUserId] = useState(null);
  const [newSelectedDate, setNewSelectedDate] = useState(null);;
  const [days, setDays] = useState([]);
  const navigate = useNavigate();
  const [showObjects, setShowObjects] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOkClick = () => {
    const formattedDate = format(calendarValue.toDate(), 'yyyy-MM-dd');
    toast.success(`Wybrano dzień: ${formattedDate}`);

    const selectedDate = calendarValue.toDate();
    const selectedDay = selectedDate.getDate();

    // Tworzymy nową listę dni, która zawiera wszystkie dni z aktualnej listy highlightedDays oraz wybrany dzień
    const updatedHighlightedDays = [...highlightedDays, selectedDay];
  
    setHighlightedDays(updatedHighlightedDays);
    setSelectedDate(selectedDate);
    setNewSelectedDate(format(selectedDate, 'yyyy-MM-dd'));
    setIsFormOpen(true);
  };

  const handleRemoveClick = () => {
    if (calendarValue) {
      const dateToRemove = calendarValue.toDate();
      setHighlightedDays((prevDays) =>
        prevDays.filter((day) => day !== dateToRemove.getDate())
      );
      setSelectedDate(null);
      setNewSelectedDate(null);
      setIsFormOpen(false); // Zamyka formularz
    }
  }

  useEffect(() => {
    if (token) {
      const decodedToken = parseJwt(token);
      if (decodedToken && decodedToken.nameid) {
        setUserId(decodedToken.nameid);
      }
    }
  }, [token]);
  
  useEffect(() => {
    if (userId && !isNaN(userId)) {
      console.log('UserId is set and is a number:', userId);
      handleShowDaysClick();
    }
  }, [userId]);  

  const handleSave = async () => {
    console.log(newSelectedDate);
    const body = {
      Description: noteValue,
      EventDate: newSelectedDate,
      UserId: parseInt(userId, 10),
    };

    const onSuccess = (response, data) => {
      toast.success('Wysłano!');
      setIsFormOpen(false);
      handleShowDaysClick();
    };

    const onFail = (response) => {
      toast.error('Brak treści');
    };

    post(ENDPOINTS.UploadCalendar, body, onSuccess, onFail, token);
  };

  const changeActive = async(day) => {
    const body = {
      description: day.description,
      eventDate: day.eventDate,
      isActive: !day.isActive,
      userId: day.userId
    };
  
    const onSuccess = (response, data) => {
      toast.success('Status aktywności zmieniony!');
      handleShowDaysClick();
    };
  
    const onFail = (response) => {
      toast.error('Wystąpił błąd przy zmianie statusu!');
    };
    console.log(day.id)
    await post(ENDPOINTS.UpdateDayStatus.replace('{dayId}', day.id), body, onSuccess, onFail, token);
  };

  const renderDaysList = () => {
    return (
      <div style={{ display: 'flex', overflowX: 'auto' }}>
        <h2>Lista dni:</h2>
        <ul style={{ display: 'flex', padding: 0, margin: 0, listStyleType: 'none' }}>
          {days.map((day) => (
            <li key={day.id} style={{ margin: '0 10px' }}>
              <p>Data: {format(new Date(day.eventDate), 'yyyy-MM-dd')}</p>
              <p>Opis: {day.description}</p>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRemoveDay(day)}
              >
                Odznacz
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const handleRemoveDay = (day) => {
    const confirmMessage = "Czy aby na pewno chcesz odznaczyć ten dzień?";
    if (window.confirm(confirmMessage)) {
      changeActive(day);
    } else {
      // Jeżeli użytkownik wybierze "Anuluj", operacja zostanie przerwana
      console.log("Operacja anulowana");
    }
  };

  const handleShowDaysClick = async () => {
      const onSuccess = (response, data) => {
        setDays(data);
        const highlightedDates = data.map((day) => new Date(day.eventDate).getDate());
        setHighlightedDays([...highlightedDays, ...highlightedDates]);
        setShowObjects(true);
      };
  
      const onFail = (response) => {
        toast.error('Login failed!');
        toast.error('Error code: ' + response.status);
  
        if (response.status === 401) {
          navigate('/logout');
        }
      };
  
      console.log(parseInt(userId, 10));
      await get(ENDPOINTS.Days.replace('{id}', parseInt(userId, 10)), onSuccess, onFail, token);
  };

  const fetchHighlightedDays = (date) => {
    setTimeout(() => {
      setHighlightedDays([]);
      setIsLoading(false);
    }, 500);
  };

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  return (
    <Grid container spacing={2} justifyContent="center" style={{ flexDirection: 'column' }}>
      <Grid item>
        <LocalizationProvider dateAdapter={AdapterDayjs} locale={plLocale}>
          <DateCalendar
            onChange={(newValue) => setCalendarValue(newValue)}
            loading={isLoading}
            onMonthChange={handleMonthChange}
            renderLoading={() => <DayCalendarSkeleton />}
            value={calendarValue}
            slots={{
              day: ServerDay,
            }}
            slotProps={{
              day: {
                highlightedDays,
                days, // Przekazujemy listę dni do komponentu ServerDay
              },
            }}
          />
          <Grid item style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleOkClick}>
              Utwórz opis
            </Button>
          </Grid>
        </LocalizationProvider>
      </Grid>

      {selectedDate && isFormOpen && (
        <Grid item>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Opis dla daty: {format(selectedDate, 'dd-MM-yyyy')}</h2>
            <TextField
              label="Dodaj notatkę"
              multiline
              rows={4}
              variant="outlined"
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
            />
            <p></p>
            <p>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Zapisz
              </Button>
              <Button variant="contained" color="secondary" onClick={handleRemoveClick}>
              Zamknij
              </Button>
            </p>
          </div>
        </Grid>
      )}

      {/* Wyświetlanie listy dni z bazy danych */}
      {showObjects && (
        <Grid item>
          <div style={{ display: 'flex', overflowX: 'auto', padding: '10px' }}>
          {showObjects && renderDaysList()}
          </div>
        </Grid>
      )}
    </Grid>
  );
}

export default PickCalendar;
