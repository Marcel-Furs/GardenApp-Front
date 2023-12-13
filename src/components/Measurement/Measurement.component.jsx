import React, { useState, useEffect } from 'react';

function Measurement() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const randomTemperature = Math.floor(Math.random() * 30) + 10; // Przykład: losowa temperatura od 10 do 40 stopni
        const randomHumidity = Math.floor(Math.random() * 50) + 40; // Przykład: losowa wilgotność od 40% do 90%

        setTemperature(randomTemperature);
        setHumidity(randomHumidity);

        await delay(1000);

      } catch (error) {
        console.error('Wystąpił błąd podczas pobierania danych:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h3>Aktualne pomiary:</h3>
      {temperature !== null && humidity !== null ? (
        <div>
          <p>Temperatura: {temperature} °C</p>
          <p>Wilgotność: {humidity} %</p>
        </div>
      ) : (
        <p>Trwa pobieranie danych...</p>
      )}
    </div>
  );
}

export default Measurement;