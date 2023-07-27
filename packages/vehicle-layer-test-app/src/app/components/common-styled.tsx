import { Box } from '@mui/material';
import styled from 'styled-components';

export const StyledMapContainer = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

export const StyledTopPanelsContainer = styled(Box)`
  top: 0;
  left: 0;
  width: 99%;
  visibility: hidden;
  position: absolute;
  z-index: 1;
`;
