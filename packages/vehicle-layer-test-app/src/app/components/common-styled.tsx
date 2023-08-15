import { Box, Paper, styled as muiStyled } from '@mui/material';
import styled from 'styled-components';

export const StyledMapContainer = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

export const StyledTopPanelsContainer = muiStyled(Box)`
  top: 0;
  left: 0;
  width: 99%;
  visibility: hidden;
  position: absolute;
  z-index: 1;
`;

export const StyledBottomRightContainer = muiStyled(Box)`
  bottom: 1.5em;
  right: 0.5em;
  width: 40rem;
  position: absolute;
  z-index: 1;
`;

export const StyledMainPaper = muiStyled(Paper)<{ bgColor?: string }>`
  padding: ${({ theme }) => theme.spacing(1)};
  textalign: 'center';
  background-color: ${({ theme, bgColor }) =>
    bgColor || theme.palette.background.paper};
  color:  ${({ theme, color }) => color || theme.palette.text.primary};
`;
