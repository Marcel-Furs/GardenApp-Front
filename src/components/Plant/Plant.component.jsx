import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ENDPOINTS } from "../../api/urls.component";
import "./Plant.component.css";
import { TextField, Button, Card, CardContent, Typography, Select, MenuItem } from '@mui/material';
import toast from 'react-hot-toast';
import { parseJwt } from '../Helpers/helpers.component';
import { useNavigate } from "react-router-dom";
import { LoginContext } from '../../context/LoginContext';
import { get ,post } from '../../api/requests.component';
import { Link as RouterLink } from 'react-router-dom';

const Grid = () => {
  const [fileSelected, setFileSelected] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [selectedElement, setSelectedElement] = useState("");
  const [devices, setDevices] = useState([]); // Stan dla urządzeń
  const [plantProfiles, setPlantProfiles] = useState([]); // Stan dla profili roślin
  const [selectedDevice, setSelectedDevice] = useState(""); // Wybrane urządzenie
  const [selectedPlantProfile, setSelectedPlantProfile] = useState('');
  const [sensors, setSensors] = useState([{ type: '', value: '' }]);
  const [token] = useContext(LoginContext);
  const [userId, setUserId] = useState(null);
  const [pathImage, setPathImage] = useState("");

  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/");
  };

  const saveFileSelected = (e) => {
    setFileSelected(e.target.files[0]);
    setPathImage(e.target.value)

    const reader = new FileReader();
    reader.onload = () => {
      setFileUrl(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

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
      getPlantProfiles();
    }
  }, [userId]);  

  const getDevices = async() => {
    const onSuccess = (resp, data) => {
      setDevices(data)
    }

    const onFail = (resp) => {
        toast.error("Failed to fetch data")
    }
    await get(ENDPOINTS.GetDevice.replace('{id}', parseInt(userId, 10)), onSuccess, onFail, token)
}

const getPlantProfiles = async() => {
  const onSuccess = (resp, data) => {
    setPlantProfiles(data)
  }

  const onFail = (resp) => {
      toast.error("Failed to fetch data")
  }
  await get(ENDPOINTS.GetPlantProfiles, onSuccess, onFail, token)
}

  const handleDeviceChange = (e) => {
    setSelectedDevice(e.target.value);
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleElementChange = (e) => {
    setSelectedElement(e.target.value);
  };

  const importFile = async () => {
    if (!fileSelected || !fileName || !selectedDevice || !selectedPlantProfile) {
      toast.error('Wszystkie pola muszą być uzupełnione.');
      return;
    }
    const formData = new FormData();
    formData.append("Image", fileSelected);
    formData.append("PathImage", pathImage);
    formData.append("PlantName", fileName);
    formData.append("DeviceId", selectedDevice);
    formData.append("PlantProfileId", selectedPlantProfile);
    console.log(formData)

    try {
      const res = await axios.post(ENDPOINTS.UploadFile, formData);
  
      if (res.status === 200 || res.status === 201) { 
        console.log(res.data);
        toast.success('Roślina została pomyślnie utworzona!'); 

        navigate('/plants');
      }
    } catch (ex) {
      console.error(ex);
      toast.error('Wystąpił błąd podczas tworzenia rośliny.');
    }
  };

  const importFile1 = async() =>{
    const body = {
      Image: fileSelected,
      PathImage: pathImage,
      PlantName: fileName,
      DeviceId: selectedDevice,
      PlantProfileId: selectedPlantProfile
    }

    const onSuccess = (response, data) => {
      console.log(body)
      toast.success('Roślina została pomyślnie utworzona!'); 
    }

    const onFail = (response) => {
      console.log(body)
      console.error(response);
      toast.error('Wystąpił błąd podczas tworzenia rośliny.');
    }
    post(ENDPOINTS.UploadFile, body, onSuccess, onFail, token)
  }

  const handlePlantProfileChange = (event) => {
    setSelectedPlantProfile(event.target.value);
  };

  return (
    <div className="grid-container">
    <Card className="grid-item">
      <CardContent>
        <div className="file-input-container">
          <input type="file" onChange={saveFileSelected} />
          <Button variant="contained" color="primary" onClick={importFile}>
            Zatwierdź
          </Button>
        </div>

        {fileSelected && (
          <div className="preview-container">
            <img
              src={fileUrl}
              alt={fileName}
              className="preview-image"
              style={{ marginBottom: '40px' }}
            />
          </div>
        )}

        <div>
          <TextField
            label="Nazwa rośliny"
            variant="outlined"
            value={fileName}
            onChange={handleFileNameChange}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
        </div>

        <div>
        <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>
          Wybierz urządzenie:
        </Typography>
        <Select
        value={selectedDevice}
        onChange={handleDeviceChange}
        fullWidth
        >
        {devices.map((device) => (
        <MenuItem key={device.id} value={device.id}>
          {device.deviceName}
        </MenuItem>
        ))}
        </Select>
        </div>
      <div>
      <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>
        Wybierz profil rośliny:
      </Typography>
      <Select
        value={selectedPlantProfile}
        onChange={handlePlantProfileChange}
        displayEmpty
        fullWidth
        >
        {plantProfiles.map(profile => (
        <MenuItem key={profile.id} value={profile.id}>
          {profile.profileName}
        </MenuItem>
        ))}
        </Select>
      </div>
      <Button
            component={RouterLink}
            to="/plantprofile"
            variant="text"
            color="secondary"
            fullWidth
            style={{ marginBottom: '20px' }}
          >
            Stwórz nowy profil rośliny
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Grid;
