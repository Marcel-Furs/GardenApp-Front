import React, { useState, useContext } from 'react';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import { post } from '../../api/requests.component';
import { LoginContext } from '../../context/LoginContext';
import { ENDPOINTS } from '../../api/urls.component';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

function PlantProfile() {
    const [profileName, setProfileName] = useState('');
    const [token, setToken] = useContext(LoginContext);

    const navigate = useNavigate();
    const handleNavigation = () => {
    navigate("/plant");
    };
    
    const handleProfileNameChange = (event) => {
        setProfileName(event.target.value);
      };

      const submitPlantProfile = () => {
        const body = {
          ProfileName: profileName,
        };
    
        const onSuccess = (response, data) => {
          toast.success('Stworzono!');
          handleNavigation()
        };
    
        const onFail = (error) => {
            toast.error('Nie udało się utworzyć rodzaju rośliny: ' + error.message);
        };
    
        post(ENDPOINTS.UploadProfileType, body, onSuccess, onFail, token);
      };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Card style={{ maxWidth: 500, padding: '20px' }}>
            <CardContent>
              <Typography variant="h4" style={{ textAlign: 'center' }}>Tworzenie nowego rodzaju rośliny</Typography>
              <TextField
                label="Nazwa typu rośliny"
                variant="outlined"
                value={profileName}
                onChange={handleProfileNameChange}
                fullWidth
                style={{ marginBottom: '20px' }}
              />
              <Button variant="contained" color="primary" fullWidth onClick={submitPlantProfile}>
                Stwórz
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

export default PlantProfile;