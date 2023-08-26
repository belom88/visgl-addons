import {
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  styled,
} from '@mui/material';
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
              <Stack direction="row" justifyContent={'end'}>
                <IconButton
                  aria-label="close"
                  onClick={() =>
                    dispatch(appActions.setTestCasesPanelVisibility(false))
                  }
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
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
