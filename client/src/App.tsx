import { useState, useEffect } from 'react';
import { LinearProgress, Typography, Grid } from '@mui/material';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { useMediaQuery} from '@mui/material';


const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [ready, setReady] = useState<boolean>(false);
  const ddClient = useDockerDesktopClient();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  if (prefersDarkMode) {
    ddClient.extension.vm?.service?.get('/dark');
  } else {
    ddClient.extension.vm?.service?.get('/light');
  }

  useEffect(() => {
    const checkIfsqlclIsReady = async () => {

      const result = await ddClient.extension.vm?.service?.get('/ready');
      const ready = Boolean(result);
      if (ready) {
        clearInterval(timer);
      }
      setReady(ready);
    };

    let timer = setInterval(() => {
      checkIfsqlclIsReady();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (ready) {
      window.location.href = 'http://localhost:9890/';
    }
  }, [ready]);

  return (
    <Grid container flex={1} direction="column" spacing={4}>
      <Grid item justifyContent="center" textAlign="center" minHeight="80px">
        {!ready && (
          <>
            <LinearProgress />
            <Typography mt={2}>
              Waiting for sqlcl to be ready. It may take some seconds if
              it's the first time.
            </Typography>
          </>
        )}
      </Grid>
    </Grid>
  );
}
