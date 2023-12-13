import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import plLocale from 'date-fns/locale/pl';
import { Button, Grid } from '@mui/material';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import './PickCalendar.component.css';
import dayjs from 'dayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import SpaIcon from '@mui/icons-material/Spa';
import { ENDPOINTS } from '../../api/urls.component';
import { LoginContext } from '../../context/LoginContext'; 
import { post } from '../../api/requests.component';


function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? <SpaIcon color="success"></SpaIcon> : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

function PickCalendar() {
  const [value, setValue] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [noteValue, setNoteValue] = useState('');
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([]);
  const initialValue = dayjs();
  const [calendarValue, setCalendarValue] = useState(initialValue);
  const [token, setToken] = useContext(LoginContext)

  const handleOkClick = () => {
    const formattedDate = format(calendarValue.toDate(), 'dd-MM-yyyy');
    toast.success(`Wybrano dzień: ${formattedDate}`);
    
    // Dodaj wybrany dzień do zaznaczonych dni
    setHighlightedDays([...highlightedDays, calendarValue.toDate().getDate()]);
    setSelectedDate(calendarValue.toDate());
  };

  const handleRemoveClick = () => {
    if (calendarValue) {
      const dateToRemove = calendarValue.toDate();
      // Usuń zaznaczony dzień z podświetlonych dni
      setHighlightedDays((prevDays) =>
        prevDays.filter((day) => day !== dateToRemove.getDate())
      );
      setSelectedDate(null);
    }
  };

  const handleSave = async () => {
    const formattedDate = format(selectedDate, 'dd-MM-yyyy');

    const body = {
      date: formattedDate.toString(),
      description: noteValue,
      userId: 5
    };

    const onSuccess = (response, data) => {
      toast.success("Wyslano!")
  }

  const onFail = (response) => {
      toast.error("Problem")
  }

  post(ENDPOINTS.UploadCalendar, body, onSuccess, onFail, token)
  };


  const fetchHighlightedDays = (date) => {
    // Możesz dodać kod asynchroniczny do pobierania dni podświetlonych z serwera lub innego źródła

    // Przykład kodu asynchronicznego (symulacja)
    setTimeout(() => {
      // Tutaj możesz dodać logikę pobierania dni podświetlonych
      // W przypadku symulacji, możesz ustawić puste dni podświetlone
      setHighlightedDays([]);
      setIsLoading(false);
    }, 500);
  };

  React.useEffect(() => {
    fetchHighlightedDays(initialValue);
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item>
      <LocalizationProvider dateAdapter={AdapterDayjs} locale={plLocale}>
      <DateCalendar
      onChange={(newValue) => setCalendarValue(newValue)}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        value = {calendarValue}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
          },
        }}
      />
              <Button variant="contained" color="primary" onClick={handleOkClick}>
            Utwórz opis
          </Button>
          <Button variant="contained" color="secondary" onClick={handleRemoveClick}>
                Usuń
          </Button>
    </LocalizationProvider>
    </Grid>

      {selectedDate && (
        <Grid item>
          <div>
            <h2>Opis dla daty: {format(selectedDate, 'dd-MM-yyyy')}</h2>
            <TextField
              label="Dodaj notatkę"
              multiline
              rows={4}
              variant="outlined"
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
            />
            {/* Tutaj możesz dodać dodatkowe pola formularza */}
            <p></p>
            <p>
            <Button variant="contained" color="primary" onClick={handleSave}> Zapisz </Button>
            </p>
          </div>
        </Grid>
      )}
    </Grid>
  );
}

export default PickCalendar;