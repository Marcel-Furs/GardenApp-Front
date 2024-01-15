import React, { useState, useEffect, useContext } from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { ENDPOINTS } from '../../api/urls.component';
import { get, post } from '../../api/requests.component';
import { LoginContext } from '../../context/LoginContext';
import toast from 'react-hot-toast';
import { parseJwt } from '../Helpers/helpers.component';
import { useNavigate } from "react-router-dom";

function Plants() {
  const [plants, setPlants] = useState([]);
  const [token, setToken] = useContext(LoginContext);
  const [sortedPlants, setSortedPlants] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [plantProfileOptions, setPlantProfileOptions] = useState([]);
  const [selectedPlantProfile, setSelectedPlantProfile] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

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
      getPlants();
    }
  }, [userId]);

  useEffect(() => {
    setSortedPlants(plants);
  }, [plants]);
  
  useEffect(() => {
    const uniqueDeviceNames = Array.from(new Set(plants.map(plant => plant.deviceName)));
    setDeviceOptions(['Wszystkie', ...uniqueDeviceNames]);
  }, [plants]);

  useEffect(() => {
    const uniquePlantProfileNames = Array.from(new Set(plants.map(plant => plant.plantProfileName)));
    setPlantProfileOptions(['Wszystkie', ...uniquePlantProfileNames]);
  }, [plants]);
  
  const handleCardClick = (plantId, plantName) => {
    navigate('/condition', { state: { plantId, plantName } });
  };

  const getPlants = async () => {
    const onSuccess = async (resp, data) => {
        console.log(data)
        const activePlants = data.filter(plant => plant.isActive); 

        const plantsWithImages = await Promise.all(activePlants.map(async plant => { 
            const imageUrl = await getImage(plant.pathImage);
            return { ...plant, imageUrl };
        }));
        setPlants(plantsWithImages);
    }

    const onFail = (resp) => {
        toast.error("Failed to fetch data");
    }
    console.log(parseInt(userId, 10))
    await get(ENDPOINTS.GetPlants.replace('{id}', parseInt(userId, 10)), onSuccess, onFail, token);
}


const getImage = async (plantName) => {
    const encodedData = encodeURIComponent(plantName);
    try {
        const response = await fetch(ENDPOINTS.GetImage.replace('{name}', encodedData));
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error:', error);
        toast.error("Failed to fetch image");
        return null;
    }
}

const handleDeletePlant = async (plantId) => {
  // Wyświetla dialog potwierdzenia
  if (window.confirm('Czy na pewno chcesz usunąć tę roślinę?')) {
    const body = {
      isActive: false 
    };

    const onSuccess = (response, data) => {
      toast.success('Status rośliny zaktualizowany na nieaktywny!');
      // Ponownie pobierz listę roślin, aby odświeżyć stan
      getPlants();
    };

    const onFail = (response) => {
      toast.error('Wystąpił błąd przy zmianie statusu!');
    };

    await post(ENDPOINTS.UpdatePlantStatus.replace('{id}', plantId), body, onSuccess, onFail, token);
  }
};


const filterByDeviceName = (deviceName) => {
  setSelectedDevice(deviceName);
  setSortedPlants(plants.filter(plant => 
    (deviceName === '' || plant.deviceName === deviceName) && plant.isActive
  ));
};

const filterByPlantProfileName = (profileName) => {
  setSelectedPlantProfile(profileName);
  setSortedPlants(profileName === '' ? plants : plants.filter(plant => plant.plantProfileName === profileName));
};

return (
  <div>
    <div style={{ display: 'flex', marginBottom: '20px' }}>
      <select onChange={(e) => filterByDeviceName(e.target.value)} value={selectedDevice}>
        {deviceOptions.map(device => (
          <option key={device} value={device === 'Wszystkie' ? '' : device}>{device}</option>
        ))}
      </select>
      <select onChange={(e) => filterByPlantProfileName(e.target.value)} value={selectedPlantProfile}>
        {plantProfileOptions.map(profile => (
          <option key={profile} value={profile === 'Wszystkie' ? '' : profile}>{profile}</option>
        ))}
      </select>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
      {sortedPlants.map((plant) => (
        <Card key={plant.id} style={{ width: '300px' }}>
          <CardMedia
            component="img"
            height="400"
            image={plant.imageUrl}
            alt={plant.plantName}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {plant.plantName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mikrokontroler: {plant.deviceName}
              <br />
              Rodzaj: {plant.plantProfileName}
            </Typography>
          </CardContent>
          <CardActions>
          <Button size="small" color="primary" onClick={() => handleCardClick(plant.id, plant.plantName)}>
              Dodaj opis
            </Button>
            <Button size="small" color="secondary" onClick={() => handleDeletePlant(plant.id)}>
            Usuń
            </Button>
          </CardActions>
        </Card>
      ))}
    </div>
  </div>
);
}

export default Plants;