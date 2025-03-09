import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Container } from '@mui/material';

function Condition() {
  const [description, setDescription] = useState('');
  const location = useLocation(); // Poprawka tutaj
  const { plantId, plantName } = location.state || {};
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/plants");
  };

  const handleSubmit = () => {
    console.log(`Opis dla rośliny o ID ${plantId} i nazwie ${plantName}:`, description);

    handleNavigation(); // Wywołanie przekierowania po wykonaniu operacji
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper style={{ marginTop: '20vh', padding: '20px', borderRadius: '15px' }} elevation={6}>
        <h3>Opis dla {plantName}</h3>
        <TextField
          label="Opis rośliny"
          multiline
          rows={4}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '10px' }}>
          Zapisz opis
        </Button>
      </Paper>
    </Container>
  );
}

export default Condition;
