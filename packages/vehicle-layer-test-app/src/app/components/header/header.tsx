import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import ChecklistIcon from '@mui/icons-material/Checklist';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  appActions,
  selectLayerPropsPanelVisibility,
  selectMapProvider,
  selectTestCasesPanelVisibility,
} from '../../redux/slices/app.slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { BASE_MAP_PROVIDERS } from '../../constants/base-map-providers';
import BaseMapModeSwitcher from '../base-map-mode-switcher/base-map-mode-switcher';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';
import { StyledOpenPanelButton } from '../common-styled';

const drawerWidth = 240;

const StyledTypography = styled(Typography)<{ selected: boolean }>`
  ${({ selected }) => {
    if (selected) {
      return `border-bottom: 2px solid #fff;`;
    }
  }}
`;

/* eslint-disable-next-line */
export interface HeaderProps {}

export function Header(props: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const baseMapProvider = useAppSelector(selectMapProvider);
  const dispatch = useAppDispatch();

  const layerPropsPanelVisibility = useAppSelector(
    selectLayerPropsPanelVisibility
  );
  const testCasesPanelVisibility = useAppSelector(
    selectTestCasesPanelVisibility
  );

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Stack
        spacing={2}
        paddingLeft={1}
        paddingRight={1}
        direction="row"
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography variant="h6" sx={{ my: 2 }}>
          Vehicle Layer
        </Typography>
      </Stack>
      <Divider />
      <List>
        {BASE_MAP_PROVIDERS.map((item) => (
          <ListItem
            component={Link}
            to={`/base-map/${item.id}`}
            sx={{ color: 'text.primary' }}
            key={item.id}
            disablePadding
          >
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <BaseMapModeSwitcher useDarkTheme={false} direction="column" />
      <Divider />
      <Stack
        direction="row"
        justifyContent={'flex-end'}
        spacing={1}
        marginTop={1}
        marginRight={1}
      >
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <StyledOpenPanelButton
            color={testCasesPanelVisibility ? 'primary' : 'secondary'}
            aria-label="open test cases panel"
            onClick={() => {
              if (testCasesPanelVisibility) {
                dispatch(appActions.setTestCasesPanelVisibility(false));
              } else {
                dispatch(appActions.setTestCasesPanelVisibility(true));
              }
            }}
          >
            <ChecklistIcon />
          </StyledOpenPanelButton>
          <StyledOpenPanelButton
            color={layerPropsPanelVisibility ? 'primary' : 'secondary'}
            aria-label="open layer properties panel"
            onClick={() => {
              if (layerPropsPanelVisibility) {
                dispatch(appActions.setLayerPropsPanelVisibility(false));
              } else {
                dispatch(appActions.setLayerPropsPanelVisibility(true));
              }
            }}
          >
            <SettingsIcon />
          </StyledOpenPanelButton>
        </ButtonGroup>
      </Stack>
    </Box>
  );

  return (
    <>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Vehicle Layer
          </Typography>
          <Box
            sx={{
              display: { xs: 'none', sm: 'none', md: 'block' },
            }}
          >
            <BaseMapModeSwitcher />
          </Box>
          <Box
            sx={{
              display: { xs: 'none', sm: 'none', md: 'block' },
            }}
          >
            {BASE_MAP_PROVIDERS.map((item) => (
              <Link key={item.id} to={`/base-map/${item.id}`}>
                <Button key={item.id} sx={{ color: '#fff' }}>
                  <StyledTypography selected={item.id === baseMapProvider.id}>
                    {' '}
                    {item.name}
                  </StyledTypography>
                </Button>
              </Link>
            ))}
          </Box>
          <Link to="https://github.com/belom88/visgl-addons" target="_blank">
            <IconButton aria-label="github" size="large">
              <GitHubIcon />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}

export default Header;
