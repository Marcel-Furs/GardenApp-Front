import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../../context/LoginContext';
import { ENDPOINTS } from '../../api/urls.component';
import { get, post } from '../../api/requests.component';
import toast from 'react-hot-toast';
import { parseJwt } from '../Helpers/helpers.component';
import Card from '@mui/material/Card';
import { Grid } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';

function Diary() {
    const [token] = useContext(LoginContext);
    const [userId, setUserId] = useState(null);
    const [inactivePlants, setInactivePlants] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [selectedPlants, setSelectedPlants] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [entryDescription, setEntryDescription] = useState(''); 

    useEffect(() => {
        if (token) {
          const decodedToken = parseJwt(token);
          if (decodedToken && decodedToken.nameid) {
            setUserId(decodedToken.nameid);
          }
        }
      }, [token]);

      useEffect(()=>{
        getInactivePlants()
        getInactiveDays()
    },[userId]);

    const getInactiveDays = async () => {
        const onSuccess = (response, data) => {
            const formattedData = data.map(event => {
                const date = new Date(event.eventDate); 
                return {
                    ...event,
                    eventDate: date.toLocaleDateString('pl-PL')
                };
            });
            setCalendarEvents(formattedData);
        };
      
        const onFail = (response) => {
        };
      
        await get(ENDPOINTS.GetInActiveDays.replace('{id}', parseInt(userId, 10)), onSuccess, onFail, token);
    };

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

    const getInactivePlants = async () => {
        const onSuccess = async (resp, data) => {
            console.log(data);
            const plantsWithImages = await Promise.all(data.map(async plant => {
                const imageUrl = await getImage(plant.pathImage);
                return { ...plant, imageUrl };
            }));
    
            // Filtrujemy tylko nieaktywne rośliny
            const inactivePlantsFiltered = plantsWithImages.filter(plant => !plant.isActive);
    
            setInactivePlants(inactivePlantsFiltered);
        };
    
        const onFail = (resp) => {
        };
    
        await get(ENDPOINTS.GetPlants.replace('{id}', parseInt(userId, 10)), onSuccess, onFail, token);
    }

    const handleCreate = async () => {

        const body = {
            EntryDate: new Date().toISOString(),
            Description: entryDescription, 
            UserId: parseInt(userId, 10), 
            PlantIds: selectedPlants, 
            CalendarIds: selectedEvents
        };
    
        const onSuccess = (response, data) => {
            toast.success('Stworzono!');
            console.log(body)
        };
    
        const onFail = (response) => {
            toast.error('Brak treści');
            console.log(body)
        };
    
        post(ENDPOINTS.CreateDiary, body, onSuccess, onFail, token);
    };

    const handlePlantCheckboxChange = (plantId) => {
        setSelectedPlants(prevSelectedPlants => {
            if (prevSelectedPlants.includes(plantId)) {
                // Jeśli identyfikator rośliny jest już zaznaczony, usuń go ze stanu
                return prevSelectedPlants.filter(id => id !== plantId);
            } else {
                // W przeciwnym razie dodaj identyfikator rośliny do stanu
                return [...prevSelectedPlants, plantId];
            }
        });
    };  

    const handleEventCheckboxChange = (eventId) => {
        setSelectedEvents(prevSelectedEvents => {
            if (prevSelectedEvents.includes(eventId)) {
                // Jeśli identyfikator wydarzenia jest już zaznaczony, usuń go ze stanu
                return prevSelectedEvents.filter(id => id !== eventId);
            } else {
                // W przeciwnym razie dodaj identyfikator wydarzenia do stanu
                return [...prevSelectedEvents, eventId];
            }
        });
        console.log("Wybrane wydarzenia:", selectedEvents);
    };
    

    const handleDescriptionChange = (e) => {
        setEntryDescription(e.target.value);
    };

    const cardStyle = {
        width: '300px', 
        height: '250px', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    };
    const cardStyle1 = {
        width: '300px', 
        height: '150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between' // Rozkłada zawartość wewnątrz karty
    };

    return (
        <div>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <h4>Nieaktywne Rośliny:</h4>
                </Grid>
                <Grid container item spacing={1}>
                    {inactivePlants.map((plant) => (
                        <Grid item key={plant.fid} xs={12} sm={6} md={4} lg={3}>
                            <Card sx={cardStyle}>
                                <CardMedia
                                    component="img"
                                    sx={{ height: 140 }}
                                    image={plant.imageUrl}
                                    alt={plant.plantName}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {plant.plantName}
                                    </Typography>
                                    {/* Tu inne informacje o roślinie */}
                                </CardContent>
                                <CardActions>
                                <Checkbox
                                checked={selectedPlants.includes(plant.id)}
                                    onChange={() => handlePlantCheckboxChange(plant.id)}
                                />
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Grid item xs={12}>
                    <h4>Nieaktywne wydarzenia z kalendarza:</h4>
                </Grid>
                <Grid container item spacing={1}>
                    {calendarEvents.map((event) => (
                        <Grid item key={event.fid} xs={12} sm={6} md={4} lg={3}>
                            <Card sx={cardStyle1}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {event.description}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {`Data wydarzenia: ${event.eventDate}`}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Checkbox
                                        checked={selectedEvents.includes(event.id)}
                                        onChange={() => handleEventCheckboxChange(event.id)}
                                    />
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <textarea 
                        placeholder="Opis do pamiętnika" 
                        value={entryDescription} 
                        onChange={handleDescriptionChange}
                        style={{ width: '300px', height: '100px' }}
                    />
                </div>
                <button onClick={handleCreate} style={{ width: '100px' }}>Zapisz</button>
            </div>
        </div>
    );   
}

export default Diary;