import { Typography, Container,Box } from '@mui/material';
import PokemonTable from './components/PokemonTable';
function App() {
  return (
    <Container>
      <Box mb={2}>
        <Typography variant="h3" align="center">
          Pokemon List
        </Typography>
      </Box>
      <PokemonTable />
    </Container>
  );
}

export default App;
