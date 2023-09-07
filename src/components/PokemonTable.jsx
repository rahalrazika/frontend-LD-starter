import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  InputAdornment,
  TableBody,
  TablePagination,
} from '@mui/material';
import { Search, Favorite } from '@mui/icons-material';

function PokemonTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pokemonData, setPokemonData] = useState([]);
  const [filterByName, setFilterByName] = useState('');
  const [filterByPower, setFilterByPower] = useState('');
  const [minPower, setMinPower] = useState(0);
  const [maxPower, setMaxPower] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    axios
      .get('/pokemon.json')
      .then((response) => {
        setPokemonData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const displayedData = pokemonData.slice(startIndex, endIndex);
    const powersOnPage = displayedData
      .map((pokemon) => pokemon.power)
      .filter((power) => !isNaN(power));

    if (powersOnPage.length > 0) {
      setMinPower(Math.min(...powersOnPage));
      setMaxPower(Math.max(...powersOnPage));
    } else {
      setMinPower(0);
      setMaxPower(0);
    }
  }, [pokemonData, page, rowsPerPage]);

  const handleChangeRows = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const searchData = pokemonData.filter((pokemon) => {
    const nameMatch = pokemon.name
      .toLowerCase()
      .includes(filterByName.toLowerCase());
    const powerMatch =
      !filterByPower || pokemon.power >= parseInt(filterByPower, 10);
    return nameMatch && powerMatch;
  });

  useEffect(() => {
    const totalPages = Math.ceil(searchData.length / rowsPerPage);
    setTotalPages(totalPages);

    if (page >= totalPages) {
      setPage(0);
    }
  }, [searchData, rowsPerPage, page]);

  const handleChange = (event, newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedData = searchData.slice(startIndex, endIndex);

  return (
    <>
      <Box
        style={{
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            type="text"
            placeholder="Search"
            value={filterByName}
            onChange={(e) => setFilterByName(e.target.value)}
            InputProps={{
              sx: {
                border: 'none !important',
                height: 45,
                padding: '10px !important',
                boxShadow: 'none !important',
              },
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            type="number"
            placeholder="Power Threshold"
            value={filterByPower}
            onChange={(e) => setFilterByPower(e.target.value)}
            InputProps={{
              sx: {
                border: 'none !important',
                height: 45,
                padding: '10px !important',
                boxShadow: 'none !important',
                marginLeft: '10px',
              },
              startAdornment: (
                <InputAdornment position="start">
                  <Favorite style={{ opacity: 0.5 }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <Box marginTop="20px">
          <Typography variant="body1">Min Power: {minPower}</Typography>
          <Typography variant="body1">Max Power: {maxPower}</Typography>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        style={{
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          borderRadius: '10px',
        }}
      >
        <Table aria-label="Pokemon table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>hp</TableCell>
              <TableCell>attack</TableCell>
              <TableCell>defense</TableCell>
              <TableCell>special_attack</TableCell>
              <TableCell>special_defense</TableCell>
              <TableCell>speed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No matching Pokémon found.
                </TableCell>
              </TableRow>
            ) : (
              displayedData.map((pokemon) => (
                <TableRow key={pokemon.id}>
                  <TableCell>{pokemon.id}</TableCell>
                  <TableCell>{pokemon.name}</TableCell>
                  <TableCell>{pokemon.type}</TableCell>
                  <TableCell>{pokemon.hp}</TableCell>
                  <TableCell>{pokemon.attack}</TableCell>
                  <TableCell>{pokemon.defense}</TableCell>
                  <TableCell>{pokemon.special_attack}</TableCell>
                  <TableCell>{pokemon.special_defense}</TableCell>
                  <TableCell>{pokemon.speed}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={searchData.length}
        page={page}
        onPageChange={handleChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRows}
      />
    </>
  );
}

export default PokemonTable;
