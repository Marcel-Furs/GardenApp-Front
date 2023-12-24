import React, { useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { LoginContext } from '../../context/LoginContext';
import { useNavigate } from 'react-router-dom';
import { get } from '../../api/requests.component';
import { ENDPOINTS } from '../../api/urls.component';
import { parseJwt } from '../Helpers/helpers.component';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import SpaIcon from '@mui/icons-material/Spa';

export function ServerDay(props) {
  const [token] = useContext(LoginContext);
  const navigate = useNavigate();
  const [days, setDays] = useState([]);
  const [userId, setUserId] = useState(null);

  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const date = day.toDate();

  const isSelected = highlightedDays.includes(day.date());

  const isDayInDatabase = days.some((databaseDay) => {
    const databaseDate = new Date(databaseDay.eventDate);
    return day.isSame(databaseDate, 'day');
  });

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? <SpaIcon color="success" /> : undefined}
      color={isDayInDatabase ? 'primary' : 'default'}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

export default ServerDay;
