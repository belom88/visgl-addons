import {
  Box,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Toolbar,
  styled,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectSelectedTestCase,
  setTestCase,
} from '../../redux/slices/test-cases.slice';
import { TEST_CASES } from '../../constants/test-cases';
import { TestCase } from '../../types';

const StyledContainer = styled(Box)`
  top: 0;
  left: 0.5em;
  width: 100%;
  visibility: hidden;
  position: absolute;
  z-index: 1;
`;

const StyledGridContainer = styled(Grid)`
  visibility: hidden;
`;

const StyledGridItem = styled(Grid)`
  visibility: visible;
`;

const StyledMainPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

/* eslint-disable-next-line */
export interface TestCasesPanelProps {}

export function TestCasesPanel(props: TestCasesPanelProps) {
  const dispatch = useAppDispatch();
  const selectedTestCase = useAppSelector(selectSelectedTestCase);
  return (
    <StyledContainer>
      <Toolbar />
      <StyledGridContainer container spacing={2}>
        <StyledGridItem item md={3}>
          <StyledMainPaper>
            <List component="nav" aria-label="test cases">
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
            </List>
          </StyledMainPaper>
        </StyledGridItem>
      </StyledGridContainer>
    </StyledContainer>
  );
}

export default TestCasesPanel;
