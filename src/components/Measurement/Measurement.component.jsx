import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

const TitleBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ContentBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: '12px',
  textTransform: 'uppercase',
}));

function Measurement() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const randomTemperature = Math.floor(Math.random() * 30) + 10;
        const randomHumidity = Math.floor(Math.random() * 50) + 40;

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
    <>
      {temperature !== null && humidity !== null && (
        <>
          <Grid xs={6} lg={3}>
            <Paper>
              <ContentBox>
                Temperatura
              </ContentBox>
              <Box component="ul" aria-labelledby="category-a" sx={{ pl: 2 }}>
                <li>{`${temperature} °C`}</li>
              </Box>
            </Paper>
          </Grid>
          <Grid xs={6} lg={3}>
            <Paper>
              <ContentBox>
                Wilgotność
              </ContentBox>
              <Box component="ul" aria-labelledby="category-b" sx={{ pl: 2 }}>
                <li>{`${humidity} %`}</li>
              </Box>
            </Paper>
          </Grid>
        </>
      )}
    </>
  );
}

export default function NestedGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={4}>
        <Grid xs={12} md={5} lg={4}>
          <Paper>
            <TitleBox>
              Podane pomiary:
            </TitleBox>
          </Paper>
        </Grid>
        <Grid container xs={12} md={7} lg={8} spacing={4}>
          <Measurement />
        </Grid>
        <Grid
          xs={12}
          container
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ xs: 'column', sm: 'row' }}
          sx={{ fontSize: '12px' }}
        >
          <Grid sx={{ order: { xs: 2, sm: 1 } }}>
          </Grid>
          <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
            <Grid>
              <Paper>
                <TitleBox>
                  Link A
                </TitleBox>
              </Paper>
            </Grid>
            <Grid>
              <Paper>
                <TitleBox>
                  Link B
                </TitleBox>
              </Paper>
            </Grid>
            <Grid>
              <Paper>
                <TitleBox>
                  Link C
                </TitleBox>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
