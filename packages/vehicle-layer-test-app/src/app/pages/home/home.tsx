import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { BASE_MAP_PROVIDERS, appActions } from '../../redux/slices/app.slice';
import DeckglWrapper from '../../components/deckgl/deckgl-wrapper';

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
  return <DeckglWrapper />;
}

export default Home;
