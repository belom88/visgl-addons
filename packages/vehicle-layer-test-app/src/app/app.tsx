import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Home from './pages/home/home';
export function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="base-map/:baseMapProviderId" element={<Home />} />
          <Route
            path="/"
            element={<Navigate to="/base-map/maplibre" replace={true} />}
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
