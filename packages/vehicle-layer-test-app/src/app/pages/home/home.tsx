import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAppDispatch } from '../../redux/hooks';
import { appActions } from '../../redux/slices/app.slice';
import LayerPropsPanel from '../../components/layer-props-panel/layer-props-panel';
import TestCasesPanel from '../../components/test-cases-panel/test-cases-panel';
import { BASE_MAP_PROVIDERS } from '../../constants/base-map-providers';
import MapWrapper from '../../components/map-wrapper/map-wrapper';
import Fps from '../../components/fps/fps';

/* eslint-disable-next-line */
export interface HomeProps {}

export function Home(props: HomeProps) {
  const { baseMapProviderId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const baseMapProvider = BASE_MAP_PROVIDERS.find(
      ({ id }) => id === baseMapProviderId
    );
    if (baseMapProvider) {
      dispatch(appActions.setMapProvider(baseMapProvider));
    }
  }, [baseMapProviderId, dispatch]);

  return (
    <Box>
      <TestCasesPanel />
      <Fps />
      <LayerPropsPanel />
      <MapWrapper />
    </Box>
  );
}

export default Home;
