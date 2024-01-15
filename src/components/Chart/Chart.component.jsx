import React, { useState, useEffect, useContext } from "react";
import "./Chart.component.css";
import { ENDPOINTS } from '../../api/urls.component';
import { post, get, get2 } from '../../api/requests.component';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { parseJwt } from '../Helpers/helpers.component';
import { LoginContext } from '../../context/LoginContext';
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from "recharts";

const Chart = () => {
  const [chartData, setChartData] = useState([]);
  const [cityInput, setCityInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useContext(LoginContext);
  const [userId, setUserId] = useState(null);
  const [chartDataTemperatures, setChartDataTemperatures] = useState([]); // Dodaj stan dla temperatur
  const [chartDataPrecipitation, setChartDataPrecipitation] = useState([]); // Dodaj stan dla opadów
  
  const fetchAndSaveWeatherData = async (city) => {
    const weatherData = await fetch(`https://danepubliczne.imgw.pl/api/data/synop/station/${city}`).then(res => res.json());
    
    const weatherMeasurementDto = {
      City: city,
      Date: new Date().toISOString().split('T')[0],
      MeasurementTime: parseInt(weatherData.godzina_pomiaru, 10),
      Temperature: parseFloat(weatherData.temperatura),
      Precipitation: parseFloat(weatherData.suma_opadu),
      UserId: parseInt(userId, 10)
    };
  
    post(ENDPOINTS.AddCity, weatherMeasurementDto, () => {
      toast.success("Dane pogodowe zostały zapisane");
    }, (error) => {
      toast.error("Błąd podczas zapisywania danych: " + error.message);
    }, token);
  };
  
  useEffect(() => {
    if(cityInput) {
      // Ustaw interwał do automatycznego zapisywania danych
      fetchDataFromDatabase(cityInput)
      const intervalId = setInterval(() => {
        fetchAndSaveWeatherData(cityInput);
      },  24 * 60 * 60 * 1000); // Wywoływane codziennie
      
      return () => clearInterval(intervalId);
    }
  }, [cityInput, token, userId]);
  

  const checkCityOnMeteorologicalSite = async (city) => {
    try {
      const response = await fetch(`https://danepubliczne.imgw.pl/api/data/synop/station/${city}`);
      if (!response.ok) {
        setError(`Nie znaleziono danych na stronie meteorologicznej dla miasta: ${city}`);
        return false;
      }
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const fetchDataFromDatabase = async (city) => {
        const onSuccess = (resp, data) => {
          setChartData(data)

          const temperatures = data.map(item => ({
            name: item.date, 
            temperatura: item.temperature,
          }));

          const precipitations = data.map(item => ({
            name: item.date, 
            suma_opadow: item.precipitation,
          }));

          setChartDataTemperatures(temperatures)
          setChartDataPrecipitation(precipitations)
      }

      const onFail = (resp) => {
         
      }

      await get2(ENDPOINTS.Data, parseInt(userId, 10), cityInput, onSuccess, onFail, token);
  };
  

  const handleCityInputChange = (event) => {
    setCityInput(event.target.value);
  };

  const handleSearchClick = async () => {
    const cityExists = await checkCityOnMeteorologicalSite(cityInput);
    if (cityExists) {
      localStorage.setItem('selectedCity', cityInput); // Zapisuje miasto w localStorage
      await fetchDataFromDatabase(cityInput);
    }
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
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
      setCityInput(savedCity);
  
      // Ustawienie interwału
      const intervalId = setInterval(() => {
        fetchAndSaveWeatherData(savedCity);
      }, 24 * 60 * 60 * 1000); // Codziennie

      return () => clearInterval(intervalId);
    }
  }, [userId]);
  
  const handleCityChange = () => {
    localStorage.removeItem('selectedCity'); // Usuwa zapamiętane miasto
    setCityInput('');
  };  

  return (
<div className="chart-container">
    <h1 className="chart-header">Średnia temperatura i suma opadów w wybranym mieście przez ostatni tydzień</h1>
    <div className="chart-input-group">
      <input
        className="chart-input"
        type="text"
        value={cityInput}
        onChange={handleCityInputChange}
        placeholder="Wpisz miasto"
      />
      <button className="chart-button" onClick={handleSearchClick}>Szukaj</button>
      <button className="chart-button" onClick={handleCityChange}>Zmień miasto</button>
    </div>
    <div className="chart-instructions">
      * Wpisz nazwę miasta bez użycia polskich znaków, dużych liter i spacji. Przykład: "zielonagora" zamiast "Zielona Góra".
    </div>
    {error && <p className="chart-error">{error}</p>}
    <div className="App">
        <h2>Temperatura</h2>
        <LineChart width={730} height={250} data={chartDataTemperatures}>
          <XAxis
          dataKey="name"
          tickFormatter={(date) => new Date(date).toLocaleDateString('pl-PL')}
          interval={0}
          />
          <YAxis
          label={{ value: '°C', position: 'insideLeft' }}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip 
          labelFormatter={(date) => new Date(date).toLocaleDateString('pl-PL')}
          />
          <Legend />
          <Line type="monotone" dataKey="temperatura" stroke="#8884d8" />
        </LineChart>
      </div>
      <div className="App">
        <h2>Suma Opadów</h2>
        <LineChart width={730} height={250} data={chartDataPrecipitation}>
          <XAxis
          dataKey="name"
          tickFormatter={(date) => new Date(date).toLocaleDateString('pl-PL')}
          interval={0}
          />
          <YAxis
          label={{ value: 'mm', position: 'insideLeft' }}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip 
          labelFormatter={(date) => new Date(date).toLocaleDateString('pl-PL')}
          />
          <Legend />
          <Line type="monotone" dataKey="suma_opadow" stroke="#CC99FF" />
        </LineChart>
      </div>
    </div>
  );
};

export default Chart;
