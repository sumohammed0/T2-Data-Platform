import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Container, Grid, Paper, Button, TextField, 
  Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, CircularProgress
} from '@mui/material';
import axios from 'axios';

const App = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interval, setInterval] = useState(5);
  const [filename, setFilename] = useState('generated_data.csv');


  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDatabases();
  }, []);

  useEffect(() => {
    if (selectedDatabase) {
      fetchTables(selectedDatabase);
    }
  }, [selectedDatabase]);

  const fetchDatabases = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/databases');
      if (Array.isArray(response.data)) {
        setDatabases(response.data);
      } else {
        throw new Error('Invalid response format for databases');
      }
    } catch (error) {
      console.error('Error fetching databases:', error);
      setError('Failed to fetch databases. Please try again later.');
      setDatabases([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async (database) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/tables/${database}`);
      if (Array.isArray(response.data)) {
        setTables(response.data);
      } else {
        throw new Error('Invalid response format for tables');
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      setError('Failed to fetch tables. Please try again later.');
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCSV = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/generate-csv', {
        start_date: startDate,
        end_date: endDate,
        interval: interval
      }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generating CSV:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !selectedDatabase || !selectedTable) {
      alert('Please select a file, database, and table');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('request', JSON.stringify({ database: selectedDatabase, table: selectedTable }));

    try {
      await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('File uploaded successfully');
      fetchTableData();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async () => {
    if (!selectedDatabase || !selectedTable) return;

    setLoading(true);
    try {
      const response = await axios.get(`/table-data/${selectedDatabase}/${selectedTable}`);
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">5G Core Network Data Manager</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        {error && (
          <Paper style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: '#ffebee' }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: '1rem' }}>
              <Typography variant="h6" gutterBottom>Generate CSV</Typography>
              <TextField
                label="Start Date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Interval (minutes)"
                type="number"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handleGenerateCSV} disabled={loading}>
                Generate and Download CSV
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: '1rem' }}>
              <Typography variant="h6" gutterBottom>Upload CSV</Typography>
              <input type="file" onChange={handleFileUpload} accept=".csv" />
              <FormControl fullWidth margin="normal">
                <InputLabel>Database</InputLabel>
                <Select value={selectedDatabase} onChange={(e) => setSelectedDatabase(e.target.value)}>
                  {Array.isArray(databases) && databases.map((db) => (
                    <MenuItem key={db} value={db}>{db}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Table</InputLabel>
                <Select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
                  {Array.isArray(tables) && tables.map((table) => (
                    <MenuItem key={table} value={table}>{table}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" onClick={handleUpload} disabled={loading}>
                Upload
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{ padding: '1rem' }}>
              <Typography variant="h6" gutterBottom>Table Data</Typography>
              {loading ? (
                <CircularProgress />
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {tableData.columns.map((column) => (
                          <TableCell key={column}>{column}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.data.map((row, index) => (
                        <TableRow key={index}>
                          {tableData.columns.map((column) => (
                            <TableCell key={column}>{row[column]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default App;