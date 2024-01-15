import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context/LoginContext';
import { ENDPOINTS } from '../../api/urls.component';
import { get } from '../../api/requests.component';
import toast from 'react-hot-toast';
import { parseJwt } from '../Helpers/helpers.component';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';


function Diaries() {
  const [diaries, setDiaries] = useState([]);
  const [token] = useContext(LoginContext);
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
      getDiaries();
    }
  }, [userId]);

  const handleNavigation = () => {
    navigate("/diary");
  };

  const getDiaries = async () => {
    const onSuccess = (resp, data) => {
      if (data && data.length > 0) {
        console.log(data)
        setDiaries(data); // Uaktualnienie stanu diaries
      } else {
        toast.error("Brak pamiętników.");
      }
    };
  
    const onFail = (resp) => {
      toast.error("Błąd podczas ładowania pamiętników.");
    };
  
    await get(ENDPOINTS.GetDiaries.replace('{userId}', parseInt(userId, 10)), onSuccess, onFail, token);
  };

  const handleDiaryClick = async (diaryId) => {
    try {
      await get(
        ENDPOINTS.GetInactiveDiaryPlants.replace('{id}', diaryId),
        (response, data) => {
          // onSuccess callback
          console.log('Success:', data);
        },
        (error) => {
          // onFail callback
          console.error('Error:', error);
        },
        token
      );
    } catch (error) {
      console.error("Błąd:", error);
      toast.error("Wystąpił błąd podczas pobierania danych.");
    }
  };
  

  return (
    <div>
      <h2>Kolekcja Pamiętników</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {diaries.map(diary => (
          <Card key={diary.id} style={{ width: 300 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Data wpisu:  {new Date(diary.entryDate).toLocaleDateString('pl-PL')}
              </Typography>
              <Typography variant="body2">
                Opis: {diary.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleDiaryClick(diary.id)}>Zobacz więcej</Button>
            </CardActions>
          </Card>
        ))}
      </div>
      {diaries.length === 0 && <p>Brak pamiętników do wyświetlenia.</p>}
      <Button variant="contained" color="primary" onClick={handleNavigation}>Stwórz Nowy Pamiętnik</Button>
    </div>
  );
}

export default Diaries;
