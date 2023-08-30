import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectSelectedTestCase,
  setTestCase,
} from '../../redux/slices/test-cases.slice';
import { TEST_CASES } from '../../constants/test-cases';
import { TestCase } from '../../types';
import {
  StyledGridContainer,
  StyledGridItem,
  StyledOpenPanelButton,
  StyledTopPanelsContainer,
} from '../common-styled';
import {
  appActions,
  selectTestCasesPanelVisibility,
} from '../../redux/slices/app.slice';

const StyledTestCasesContainer = styled(StyledTopPanelsContainer)`
  left: 0.5em;
`;

const StyledHeaderTypography = styled(Typography)`
  padding-left: ${({ theme }) => theme.spacing(1)};
`;

const StyledHeaderStack = styled(Stack)`
  padding-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledButton = styled(StyledOpenPanelButton)`
  top: 0.5em;
`;

const StyledList = styled(List)`
  max-height: calc(100vh - 150px);
  overflow: auto;
`;

const StyledMainPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  max-height: calc(100vh - 80px);
  overflow: hidden;
`;

/* eslint-disable-next-line */
export interface TestCasesPanelProps {}

export function TestCasesPanel(props: TestCasesPanelProps) {
  const dispatch = useAppDispatch();
  const selectedTestCase = useAppSelector(selectSelectedTestCase);
  const testCasesPanelVisibility = useAppSelector(
    selectTestCasesPanelVisibility
  );

  return (
    <StyledTestCasesContainer>
      <Toolbar />
      {testCasesPanelVisibility && (
        <StyledGridContainer container spacing={2}>
          <StyledGridItem item md={3} sm={5} xs={12}>
            <StyledMainPaper>
              <StyledHeaderStack
                direction="row"
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <Avatar variant="rounded">
                  <ChecklistIcon />
                </Avatar>{' '}
                <StyledHeaderTypography variant="h6">
                  Presets
                </StyledHeaderTypography>
                <IconButton
                  aria-label="close"
                  onClick={() =>
                    dispatch(appActions.setTestCasesPanelVisibility(false))
                  }
                >
                  <CloseIcon />
                </IconButton>
              </StyledHeaderStack>
              {/* @ts-expect-error MUI List inheritance error */}
              <StyledList component="nav" aria-label="test cases">
                {TEST_CASES.map((testCase: TestCase) => {
                  return (
                    <ListItemButton
                      aria-label={`test-case-${testCase.id}`}
                      key={testCase.id}
                      selected={testCase.id === selectedTestCase?.id}
                      onClick={() => dispatch(setTestCase(testCase))}
                    >
                      <ListItemText
                        primary={testCase.name}
                        secondary={testCase.description}
                      />
                    </ListItemButton>
                  );
                })}
              </StyledList>
            </StyledMainPaper>
          </StyledGridItem>
        </StyledGridContainer>
      )}
      {!testCasesPanelVisibility && (
        <StyledButton
          variant="contained"
          aria-label="open test cases panel"
          onClick={() => dispatch(appActions.setTestCasesPanelVisibility(true))}
          sx={{
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          <ChecklistIcon />
        </StyledButton>
      )}
    </StyledTestCasesContainer>
  );
}

export default TestCasesPanel;
