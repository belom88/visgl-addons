import { Box, Toolbar, styled } from '@mui/material';
import { StyledTopPanelsContainer } from '../common-styled';
import { useAppSelector } from '../../redux/hooks';
import { selectFps } from '../../redux/slices/app.slice';

const StyledFpsWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  visibility: visible;
`;

/* eslint-disable-next-line */
export interface FpsProps {}

export function Fps(props: FpsProps) {
  const fps = useAppSelector(selectFps);
  return (
    <StyledTopPanelsContainer>
      <Toolbar />
      <StyledFpsWrapper>fps: {fps.toFixed(3)}</StyledFpsWrapper>
    </StyledTopPanelsContainer>
  );
}

export default Fps;
