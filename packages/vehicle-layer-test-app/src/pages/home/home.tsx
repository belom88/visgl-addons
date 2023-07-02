import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface HomeProps {}

export function Home(props: HomeProps) {
  const {mapProviderId} = useParams();
  return (
    <Typography>
      Show {mapProviderId}
    </Typography>
  );
}

export default Home;
