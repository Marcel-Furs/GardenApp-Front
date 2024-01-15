import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { LoginContext } from '../../context/LoginContext';
import { ENDPOINTS } from '../../api/urls.component';
import { get ,post } from '../../api/requests.component';
import toast from 'react-hot-toast';
import { parseJwt } from '../Helpers/helpers.component';
import { useNavigate } from "react-router-dom";

function Device() {
  const [deviceName, setDeviceName] = useState('');
  const [sensorTypes, setSensorTypes] = useState([]);
  const [sensors, setSensors] = useState([{ type: '', value: '' }]);
  const [token] = useContext(LoginContext);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

    useEffect(()=>{
        getSensorType()
    },[userId]);

    useEffect(() => {
        if (token) {
          const decodedToken = parseJwt(token);
          if (decodedToken && decodedToken.nameid) {
            setUserId(decodedToken.nameid);
          }
        }
      }, [token]);

    const getSensorType = async() => {
        const onSuccess = (resp, data) => {
            setSensorTypes(data)
        }

        const onFail = (resp) => {
            toast.error("Failed to fetch data")
        }
        await get(ENDPOINTS.GetSensorType, onSuccess, onFail, token)
    }

    const submitDevice = () => {
        const formattedSensors = sensors.map(sensor => ({
            sensorTypeId: sensor.type,
            sensorValue: sensor.value 
          }));
        const body = {
            DeviceName: deviceName,
            Sensors: formattedSensors,
            UserId: parseInt(userId, 10)
        };
    
        const onSuccess = () => {
          toast.success('Stworzono pomyślnie mikrokontroler!');
          handleNavigation()
        };
    
        const onFail = (error) => {
        };
    
        post(ENDPOINTS.UploadDevice.replace('{id}', parseInt(userId, 10)), body, onSuccess, onFail, token);
      };
  
      const handleNavigation = () => {
        navigate("/");
      };

  const handleDeviceNameChange = (event) => {
    setDeviceName(event.target.value);
  };

  const handleSensorChange = (index, event) => {
    const newSensors = sensors.map((sensor, i) => {
      if (i === index) {
        return { ...sensor, [event.target.name]: event.target.value };
      }
      return sensor;
    });
    setSensors(newSensors);
  };

  const removeSensor = (index) => {
    const newSensors = sensors.filter((_, i) => i !== index);
    setSensors(newSensors);
  };

  const addSensor = () => {
    setSensors([...sensors, { type: '', value: '' }]);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ maxWidth: 500, padding: '20px' }}>
        <CardContent>
          <Typography variant="h4" style={{ textAlign: 'center' }}>Rejestracja Urządzenia</Typography>
          <TextField
            label="Nazwa Urządzenia"
            variant="outlined"
            value={deviceName}
            onChange={handleDeviceNameChange}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
        <Typography variant="h5" style={{ marginBottom: '10px' }}>Sensory</Typography>
        {sensors.map((sensor, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
        <FormControl fullWidth>
        <InputLabel>Typ Sensora</InputLabel>
        <Select
            value={sensor.type}
            onChange={(e) => handleSensorChange(index, e)}
            name="type"
        >
        {sensorTypes.map((type) => (
        <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
        ))}
        </Select>
        </FormControl>
        </div>
        ))}
          <Button variant="outlined" onClick={addSensor} style={{ marginBottom: '20px' }}>
            Dodaj Sensor
          </Button>
          <Button
            component={RouterLink}
            to="/sensortype"
            variant="text"
            color="secondary"
            fullWidth
            style={{ marginBottom: '20px' }}
          >
            Stwórz nowy typ sensora
          </Button>
          <Button variant="contained" color="primary" fullWidth onClick={submitDevice}>
            Zarejestruj Urządzenie
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Device;
