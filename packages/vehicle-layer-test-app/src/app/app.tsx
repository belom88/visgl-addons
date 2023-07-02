import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/home/home';
import Header from '../components/header/header';

export function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="base-map/:mapProviderId" element={<Home />} />
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
