import React, { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import toast from 'react-hot-toast';
import { ENDPOINTS } from "../../api/urls.component";
import { parseJwt } from '../Helpers/helpers.component';
import { LoginContext } from '../../context/LoginContext';
import { get } from '../../api/requests.component';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  color: theme.palette.text.secondary,
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: theme.spacing(1),
  color: theme.palette.text.primary,
}));

function Measurement({ controller }) {
  const [userId, setUserId] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [token] = useContext(LoginContext);
  const [deviceName, setDeviceName] = useState(null);

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
      getDevices();
    }
  }, [userId]);

  useEffect(() => {
    const generateRandomData = () => {
      const randomTemperature = Math.floor(Math.random() * 35) + 5;
      const randomHumidity = Math.floor(Math.random() * 100) + 1;
      setTemperature(randomTemperature);
      setHumidity(randomHumidity);
    };

    if (controller) {
      generateRandomData();
    }
  }, [controller]);

  const getDevices = async () => {
    const onSuccess = (resp, data) => {
      if (data.length > 0) {
        setDeviceName(data[0].deviceName);
      }
    };

    const onFail = (resp) => {
      toast.error("Failed to fetch data");
    };
    await get(ENDPOINTS.GetDevice.replace('{id}', parseInt(userId, 10)), onSuccess, onFail, token);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <StyledCard>
          <CardContent>
            <TitleTypography>Temperatura</TitleTypography>
            <Typography variant="h5" component="div">
              {temperature !== null ? `${temperature}°C` : 'Brak danych'}
            </Typography>
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <StyledCard>
          <CardContent>
            <TitleTypography>Wilgotność</TitleTypography>
            <Typography variant="h5" component="div">
              {humidity !== null ? `${humidity}%` : 'Brak danych'}
            </Typography>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  );
}

export default function NestedGrid() {
  const [controller, setController] = useState('');

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <FormControl style={{ minWidth: 120 }}>
              <Select
                value={controller}
                onChange={(e) => setController(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="" disabled>
                  Wybierz mikrokontroler
                </MenuItem>
                <MenuItem value={'Esp-32'}>Esp-32</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Measurement controller={controller} />
        </Grid>
      </Grid>
    </div>
  );
}
