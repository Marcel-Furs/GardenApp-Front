import React, { useState, useContext } from 'react';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import { post } from '../../api/requests.component';
import { LoginContext } from '../../context/LoginContext';
import { ENDPOINTS } from '../../api/urls.component';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

function SensorType() {
  const [sensorTypeName, setSensorTypeName] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState('');
  const [token, setToken] = useContext(LoginContext);
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate("/device");
  };

  const handleSensorTypeNameChange = (event) => {
    setSensorTypeName(event.target.value);
  };

  const handleMeasurementUnitChange = (event) => {
    setMeasurementUnit(event.target.value);
  };

  const submitSensorType = () => {
    const body = {
      Name: sensorTypeName,
      MeasurementUnit: measurementUnit,
    };

    const onSuccess = (response, data) => {
      toast.success('Stworzono!');
      handleNavigation()
    };

    const onFail = (error) => {
        toast.error('Nie udało się utworzyć typu sensora: ' + error.message);
    };

    post(ENDPOINTS.UploadSensorType, body, onSuccess, onFail, token);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ maxWidth: 500, padding: '20px' }}>
        <CardContent>
          <Typography variant="h4" style={{ textAlign: 'center' }}>Tworzenie nowego typu sensora</Typography>
          <TextField
            label="Nazwa Typu Sensora"
            variant="outlined"
            value={sensorTypeName}
            onChange={handleSensorTypeNameChange}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
          <TextField
            label="Jednostka pomiarowa"
            variant="outlined"
            value={measurementUnit}
            onChange={handleMeasurementUnitChange}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={submitSensorType}>
            Stwórz Typ Sensora
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default SensorType;