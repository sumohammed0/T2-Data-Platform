import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const API_BASE_URL = 'http://localhost:8000';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PhoneSpecsApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [latestPhones, setLatestPhones] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLatestPhones();
  }, []);

  const handleApiError = (err) => {
    const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
    setError(errorMessage);
    console.error('API Error:', errorMessage);
  };

  const fetchLatestPhones = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/latest`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch latest phones');
      }
      const data = await response.json();
      setLatestPhones(data.latest || []);
      setError(null);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/search?query=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch search results');
      }
      const data = await response.json();
      setSearchResults(data.results || []);
      setTabValue(1);
      setError(null);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhoneDetails = async (slug) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/phone/${slug}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch phone details');
      }
      const data = await response.json();
      setSelectedPhone(data);
      setError(null);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const PhoneCard = ({ phone, onClick }) => (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        '&:hover': { boxShadow: 6 },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Box>
          <Typography variant="h6">
            {phone.phone_name || phone.brand_name || 'Unknown Phone'}
          </Typography>
          <Typography color="textSecondary">
            {phone.brand || 'Unknown Brand'}
          </Typography>
        </Box>
        <ChevronRightIcon />
      </CardContent>
    </Card>
  );

  return (
    <Paper sx={{ maxWidth: 800, margin: 'auto', mt: 4, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 2 
        }}>
          <PhoneAndroidIcon fontSize="large" />
          Phone Specifications
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Search phones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
          >
            Search
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Latest Phones" />
            <Tab label="Search Results" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          {latestPhones.length > 0 ? (
            latestPhones.map((phone) => (
              <PhoneCard
                key={phone.slug || phone.id}
                phone={phone}
                onClick={() => fetchPhoneDetails(phone.slug)}
              />
            ))
          ) : (
            <Typography color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
              No phones found
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {searchResults.length > 0 ? (
            searchResults.map((phone) => (
              <PhoneCard
                key={phone.slug || phone.id}
                phone={phone}
                onClick={() => fetchPhoneDetails(phone.slug)}
              />
            ))
          ) : (
            <Typography color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
              No search results found
            </Typography>
          )}
        </TabPanel>
      </Box>

      {selectedPhone && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {selectedPhone.phone_name || selectedPhone.brand_name || 'Phone Details'}
            </Typography>
            
            {selectedPhone.specifications ? (
              selectedPhone.specifications.map((spec, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <Typography variant="h6">{spec.title}</Typography>
                  <List dense>
                    {spec.specs.map((item, idx) => (
                      <ListItem key={idx}>
                        <ListItemText 
                          primary={`${item.key}: ${Array.isArray(item.val) ? item.val.join(', ') : item.val}`} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))
            ) : (
              <Typography color="textSecondary">
                No specifications available
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Paper>
  );
};

export default PhoneSpecsApp;