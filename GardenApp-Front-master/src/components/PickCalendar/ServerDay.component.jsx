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
import { format } from 'date-fns';

export function ServerDay(props) {
  const { currentMonth, highlightedDays = [], days = [], day, outsideCurrentMonth, ...other } = props;

  const date = day.toDate();
  const formattedDate = format(date, 'yyyy-MM-dd');

  // Sprawdź czy dzień jest w obecnym miesiącu.
  const isInCurrentMonth = day.month() === currentMonth;

  const isSelected = isInCurrentMonth && highlightedDays.some(highlightedDate => {
    const validDate = new Date(highlightedDate);
    return !isNaN(validDate) && format(validDate, 'yyyy-MM-dd') === formattedDate;
  });

  const isDayInDatabase = isInCurrentMonth && days.some(databaseDay => 
    databaseDay.eventDate === formattedDate
  );

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? <SpaIcon color="success" /> : undefined}
      color={isDayInDatabase ? 'default' : 'default'}
    >
      <PickersDay 
        {...other} 
        day={day} 
        outsideCurrentMonth={outsideCurrentMonth}
      />
    </Badge>
  );
}

export default ServerDay;