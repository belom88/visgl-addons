import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { appActions, baseMapsProviders } from '../../redux/slices/app.slice';

/* eslint-disable-next-line */
export interface HomeProps {}

export function Home(props: HomeProps) {
  const { baseMapProviderId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const baseMapProvider = baseMapsProviders.find(
      ({ id }) => id === baseMapProviderId
    );
    if (baseMapProvider) {
      dispatch(appActions.setMapProviderId(baseMapProvider));
    }
  }, [baseMapProviderId, dispatch]);
  return <Typography>Show {baseMapProviderId}</Typography>;
}

export default Home;
