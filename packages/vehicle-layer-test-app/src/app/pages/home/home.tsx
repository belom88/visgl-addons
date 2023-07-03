import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { appActions, baseMapsProviders } from '../../redux/slices/app.slice';
import Deckgl from '../../components/deckgl/deckgl';

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
  return <Deckgl />;
}

export default Home;
