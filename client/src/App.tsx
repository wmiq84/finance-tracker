import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { themeSettings } from './theme';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
            <Routes>
              <Route path ="/" element={<p>predictions</p>}></Route>
            </Routes>
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
